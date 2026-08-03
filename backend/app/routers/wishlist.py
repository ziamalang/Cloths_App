from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.dependencies import get_current_user
from app.models import Product, User, WishlistItem
from app.schemas import WishlistItemOut

router = APIRouter(prefix="/wishlist", tags=["Wishlist"])


@router.get("", response_model=list[WishlistItemOut])
def get_wishlist(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return (
        db.query(WishlistItem)
        .options(joinedload(WishlistItem.product).joinedload(Product.category))
        .filter(WishlistItem.user_id == user.id)
        .order_by(WishlistItem.created_at.desc())
        .all()
    )


@router.post("/{product_id}", response_model=WishlistItemOut, status_code=201)
def add_to_wishlist(product_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id, Product.is_active == True).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    existing = db.query(WishlistItem).filter(WishlistItem.user_id == user.id, WishlistItem.product_id == product_id).first()
    if existing:
        return db.query(WishlistItem).options(joinedload(WishlistItem.product).joinedload(Product.category)).filter(WishlistItem.id == existing.id).first()

    item = WishlistItem(user_id=user.id, product_id=product_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return db.query(WishlistItem).options(joinedload(WishlistItem.product).joinedload(Product.category)).filter(WishlistItem.id == item.id).first()


@router.delete("/{product_id}")
def remove_from_wishlist(product_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = db.query(WishlistItem).filter(WishlistItem.user_id == user.id, WishlistItem.product_id == product_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Wishlist item not found")
    db.delete(item)
    db.commit()
    return {"message": "Removed from wishlist"}
