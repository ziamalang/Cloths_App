from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.dependencies import get_current_admin
from app.models import Order, Product, User
from app.schemas import AdminStats, OrderOut, UserOut

router = APIRouter(prefix="/admin", tags=["Admin Dashboard"])


@router.get("/stats", response_model=AdminStats)
def admin_stats(db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    total_products = db.query(func.count(Product.id)).filter(Product.is_active == True).scalar() or 0
    total_orders = db.query(func.count(Order.id)).scalar() or 0
    total_users = db.query(func.count(User.id)).filter(User.role == "customer").scalar() or 0
    total_revenue = db.query(func.coalesce(func.sum(Order.total), 0)).filter(Order.payment_status == "paid").scalar() or 0
    pending_orders = db.query(func.count(Order.id)).filter(Order.status.in_(["pending", "confirmed", "processing"])).scalar() or 0

    return AdminStats(
        total_products=total_products,
        total_orders=total_orders,
        total_users=total_users,
        total_revenue=float(total_revenue),
        pending_orders=pending_orders,
    )


@router.get("/orders", response_model=list[OrderOut])
def admin_list_orders(db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    return (
        db.query(Order)
        .options(joinedload(Order.items), joinedload(Order.status_history))
        .order_by(Order.created_at.desc())
        .all()
    )


@router.get("/users", response_model=list[UserOut])
def admin_list_users(db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    return db.query(User).filter(User.role == "customer").order_by(User.created_at.desc()).all()
