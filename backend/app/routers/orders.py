from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.config import settings
from app.database import get_db
from app.dependencies import get_current_admin, get_current_user
from app.models import CartItem, Order, OrderItem, OrderStatusHistory, Product, User
from app.schemas import CheckoutRequest, OrderOut, OrderStatusUpdate, PaymentConfirm
from app.services.email import send_order_confirmation, send_order_status_update
from app.services.payment import create_payment_intent, verify_payment
from app.utils.helpers import generate_order_number, generate_tracking_number

router = APIRouter(prefix="/orders", tags=["Orders & Checkout"])


@router.post("/checkout")
def checkout(data: CheckoutRequest, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    cart_items = db.query(CartItem).options(joinedload(CartItem.product)).filter(CartItem.user_id == user.id).all()
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    subtotal = 0.0
    for item in cart_items:
        if item.product.stock < item.quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for {item.product.name}")
        subtotal += float(item.product.price) * item.quantity

    shipping_fee = settings.SHIPPING_FEE
    total = subtotal + shipping_fee
    order_number = generate_order_number()

    payment = create_payment_intent(total, order_number)

    order = Order(
        user_id=user.id,
        order_number=order_number,
        status="pending",
        subtotal=subtotal,
        shipping_fee=shipping_fee,
        total=total,
        shipping_name=data.shipping_name,
        shipping_email=data.shipping_email,
        shipping_phone=data.shipping_phone,
        shipping_address=data.shipping_address,
        shipping_city=data.shipping_city,
        notes=data.notes,
        payment_intent_id=payment["payment_intent_id"],
        payment_status="pending",
    )
    db.add(order)
    db.flush()

    for item in cart_items:
        line_total = float(item.product.price) * item.quantity
        db.add(OrderItem(
            order_id=order.id,
            product_id=item.product.id,
            product_name=item.product.name,
            product_price=float(item.product.price),
            quantity=item.quantity,
            line_total=line_total,
        ))

    db.add(OrderStatusHistory(order_id=order.id, status="pending", note="Order placed"))
    db.commit()

    return {
        "order_number": order_number,
        "subtotal": subtotal,
        "shipping_fee": shipping_fee,
        "total": total,
        "client_secret": payment["client_secret"],
        "payment_intent_id": payment["payment_intent_id"],
        "mock_payment": payment.get("mock", False),
        "stripe_publishable_key": settings.STRIPE_PUBLISHABLE_KEY,
    }


@router.post("/confirm-payment", response_model=OrderOut)
async def confirm_payment(data: PaymentConfirm, background_tasks: BackgroundTasks, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    order = (
        db.query(Order)
        .options(joinedload(Order.items), joinedload(Order.status_history))
        .filter(Order.order_number == data.order_number, Order.user_id == user.id)
        .first()
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.payment_status == "paid":
        return order

    if not verify_payment(data.payment_intent_id):
        order.payment_status = "failed"
        db.commit()
        raise HTTPException(status_code=400, detail="Payment verification failed")

    order.payment_status = "paid"
    order.status = "confirmed"
    order.payment_intent_id = data.payment_intent_id

    cart_items = db.query(CartItem).options(joinedload(CartItem.product)).filter(CartItem.user_id == user.id).all()
    for item in cart_items:
        product = db.query(Product).filter(Product.id == item.product_id).with_for_update().first()
        if product:
            product.stock -= item.quantity
    db.query(CartItem).filter(CartItem.user_id == user.id).delete()

    db.add(OrderStatusHistory(order_id=order.id, status="confirmed", note="Payment received"))
    db.commit()
    db.refresh(order)

    background_tasks.add_task(send_order_confirmation, order.shipping_email, order.order_number, float(order.total))
    return order


@router.get("", response_model=list[OrderOut])
def list_my_orders(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return (
        db.query(Order)
        .options(joinedload(Order.items), joinedload(Order.status_history))
        .filter(Order.user_id == user.id)
        .order_by(Order.created_at.desc())
        .all()
    )


@router.get("/{order_number}", response_model=OrderOut)
def get_order(order_number: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    order = (
        db.query(Order)
        .options(joinedload(Order.items), joinedload(Order.status_history))
        .filter(Order.order_number == order_number, Order.user_id == user.id)
        .first()
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.get("/track/{order_number}", response_model=OrderOut)
def track_order(order_number: str, db: Session = Depends(get_db)):
    order = (
        db.query(Order)
        .options(joinedload(Order.items), joinedload(Order.status_history))
        .filter(Order.order_number == order_number)
        .first()
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.put("/admin/{order_id}/status", response_model=OrderOut, tags=["Admin"])
async def update_order_status(
    order_id: int,
    data: OrderStatusUpdate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    order = db.query(Order).options(joinedload(Order.items), joinedload(Order.status_history)).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    valid_statuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]
    if data.status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Invalid status")

    order.status = data.status
    if data.tracking_number:
        order.tracking_number = data.tracking_number
    elif data.status == "shipped" and not order.tracking_number:
        order.tracking_number = generate_tracking_number()

    db.add(OrderStatusHistory(order_id=order.id, status=data.status, note=data.note))
    db.commit()
    db.refresh(order)

    background_tasks.add_task(
        send_order_status_update,
        order.shipping_email,
        order.order_number,
        data.status,
        order.tracking_number,
    )
    return order
