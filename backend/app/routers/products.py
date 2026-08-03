from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.dependencies import get_current_admin
from app.models import Category, Product, User
from app.schemas import CategoryCreate, CategoryOut, CategoryUpdate, ProductCreate, ProductOut, ProductUpdate

router = APIRouter(tags=["Products & Categories"])


# --- Categories (Public) ---
@router.get("/categories", response_model=list[CategoryOut])
def list_categories(active_only: bool = True, db: Session = Depends(get_db)):
    query = db.query(Category)
    if active_only:
        query = query.filter(Category.is_active == True)
    return query.order_by(Category.name).all()


@router.get("/categories/{slug}", response_model=CategoryOut)
def get_category(slug: str, db: Session = Depends(get_db)):
    cat = db.query(Category).filter(Category.slug == slug).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    return cat


# --- Products (Public) ---
@router.get("/products", response_model=list[ProductOut])
def list_products(
    category_id: Optional[int] = None,
    featured: Optional[bool] = None,
    search: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(Product).options(joinedload(Product.category)).filter(Product.is_active == True)
    if category_id:
        query = query.filter(Product.category_id == category_id)
    if featured is not None:
        query = query.filter(Product.is_featured == featured)
    if search:
        query = query.filter(Product.name.ilike(f"%{search}%"))
    return query.order_by(Product.created_at.desc()).offset(skip).limit(limit).all()


@router.get("/products/{slug}", response_model=ProductOut)
def get_product(slug: str, db: Session = Depends(get_db)):
    product = db.query(Product).options(joinedload(Product.category)).filter(Product.slug == slug).first()
    if not product or not product.is_active:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


# --- Admin: Categories CRUD ---
@router.post("/admin/categories", response_model=CategoryOut, tags=["Admin"])
def create_category(data: CategoryCreate, db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    if db.query(Category).filter((Category.name == data.name) | (Category.slug == data.slug)).first():
        raise HTTPException(status_code=400, detail="Category already exists")
    cat = Category(**data.model_dump())
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat


@router.put("/admin/categories/{category_id}", response_model=CategoryOut, tags=["Admin"])
def update_category(category_id: int, data: CategoryUpdate, db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(cat, field, value)
    db.commit()
    db.refresh(cat)
    return cat


@router.delete("/admin/categories/{category_id}", tags=["Admin"])
def delete_category(category_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    cat.is_active = False
    db.commit()
    return {"message": "Category deactivated"}


# --- Admin: Products CRUD ---
@router.post("/admin/products", response_model=ProductOut, tags=["Admin"])
def create_product(data: ProductCreate, db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    if db.query(Product).filter(Product.slug == data.slug).first():
        raise HTTPException(status_code=400, detail="Product slug already exists")
    if not db.query(Category).filter(Category.id == data.category_id).first():
        raise HTTPException(status_code=400, detail="Category not found")
    product = Product(**data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return db.query(Product).options(joinedload(Product.category)).filter(Product.id == product.id).first()


@router.put("/admin/products/{product_id}", response_model=ProductOut, tags=["Admin"])
def update_product(product_id: int, data: ProductUpdate, db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(product, field, value)
    db.commit()
    return db.query(Product).options(joinedload(Product.category)).filter(Product.id == product_id).first()


@router.delete("/admin/products/{product_id}", tags=["Admin"])
def delete_product(product_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product.is_active = False
    db.commit()
    return {"message": "Product deactivated"}
