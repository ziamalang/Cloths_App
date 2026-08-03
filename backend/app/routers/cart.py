from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.dependencies import get_current_user
from app.models import CartItem, Product, User
from app.schemas import CartItemCreate, CartItemOut, CartItemUpdate

router = APIRouter(prefix="/cart", tags=["Shopping Cart"])


@router.get("", response_model=list[CartItemOut])
def get_cart(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return (
        db.query(CartItem)
        .options(joinedload(CartItem.product).joinedload(Product.category))
        .filter(CartItem.user_id == user.id)
        .all()
    )


@router.post("", response_model=CartItemOut, status_code=201)
def add_to_cart(data: CartItemCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == data.product_id, Product.is_active == True).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if product.stock < data.quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock")

    existing = db.query(CartItem).filter(CartItem.user_id == user.id, CartItem.product_id == data.product_id).first()
    if existing:
        existing.quantity += data.quantity
        if existing.quantity > product.stock:
            raise HTTPException(status_code=400, detail="Insufficient stock")
        db.commit()
        db.refresh(existing)
        return db.query(CartItem).options(joinedload(CartItem.product).joinedload(Product.category)).filter(CartItem.id == existing.id).first()

    item = CartItem(user_id=user.id, product_id=data.product_id, quantity=data.quantity)
    db.add(item)
    db.commit()
    db.refresh(item)
    return db.query(CartItem).options(joinedload(CartItem.product).joinedload(Product.category)).filter(CartItem.id == item.id).first()


@router.put("/{item_id}", response_model=CartItemOut)
def update_cart_item(item_id: int, data: CartItemUpdate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.user_id == user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    if item.product.stock < data.quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock")
    item.quantity = data.quantity
    db.commit()
    return db.query(CartItem).options(joinedload(CartItem.product).joinedload(Product.category)).filter(CartItem.id == item_id).first()


@router.delete("/{item_id}")
def remove_cart_item(item_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.user_id == user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    db.delete(item)
    db.commit()
    return {"message": "Item removed from cart"}


@router.delete("")
def clear_cart(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db.query(CartItem).filter(CartItem.user_id == user.id).delete()
    db.commit()
    return {"message": "Cart cleared"}
