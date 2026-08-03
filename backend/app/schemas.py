from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    first_name: str
    last_name: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None


class UserOut(BaseModel):
    id: int
    email: str
    first_name: str
    last_name: str
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    role: str
    created_at: datetime

    model_config = {"from_attributes": True}


class CategoryCreate(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    image_url: Optional[str] = None


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None


class CategoryOut(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    is_active: bool

    model_config = {"from_attributes": True}


class ProductCreate(BaseModel):
    category_id: int
    name: str
    slug: str
    description: Optional[str] = None
    price: float = Field(gt=0)
    compare_price: Optional[float] = None
    stock: int = Field(ge=0, default=0)
    image_url: Optional[str] = None
    images: Optional[list[str]] = None
    colors: Optional[list[str]] = None
    tag: Optional[str] = None
    is_featured: bool = False


class ProductUpdate(BaseModel):
    category_id: Optional[int] = None
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = Field(default=None, gt=0)
    compare_price: Optional[float] = None
    stock: Optional[int] = Field(default=None, ge=0)
    image_url: Optional[str] = None
    images: Optional[list[str]] = None
    colors: Optional[list[str]] = None
    tag: Optional[str] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None


class ProductOut(BaseModel):
    id: int
    category_id: int
    name: str
    slug: str
    description: Optional[str] = None
    price: float
    compare_price: Optional[float] = None
    stock: int
    image_url: Optional[str] = None
    images: Optional[list[str]] = None
    colors: Optional[list[str]] = None
    tag: Optional[str] = None
    is_featured: bool
    is_active: bool
    category: Optional[CategoryOut] = None

    model_config = {"from_attributes": True}


class CartItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(ge=1, default=1)


class CartItemUpdate(BaseModel):
    quantity: int = Field(ge=1)


class CartItemOut(BaseModel):
    id: int
    product_id: int
    quantity: int
    product: ProductOut

    model_config = {"from_attributes": True}


class WishlistItemOut(BaseModel):
    id: int
    product_id: int
    product: ProductOut
    created_at: datetime

    model_config = {"from_attributes": True}


class CheckoutRequest(BaseModel):
    shipping_name: str
    shipping_email: EmailStr
    shipping_phone: str
    shipping_address: str
    shipping_city: str
    notes: Optional[str] = None


class PaymentConfirm(BaseModel):
    order_number: str
    payment_intent_id: str


class OrderItemOut(BaseModel):
    id: int
    product_id: int
    product_name: str
    product_price: float
    quantity: int
    line_total: float

    model_config = {"from_attributes": True}


class OrderStatusHistoryOut(BaseModel):
    id: int
    status: str
    note: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class OrderOut(BaseModel):
    id: int
    order_number: str
    status: str
    subtotal: float
    shipping_fee: float
    total: float
    shipping_name: str
    shipping_email: str
    shipping_phone: str
    shipping_address: str
    shipping_city: str
    payment_method: str
    payment_status: str
    tracking_number: Optional[str] = None
    created_at: datetime
    items: list[OrderItemOut] = []
    status_history: list[OrderStatusHistoryOut] = []

    model_config = {"from_attributes": True}


class OrderStatusUpdate(BaseModel):
    status: str
    note: Optional[str] = None
    tracking_number: Optional[str] = None


class AdminStats(BaseModel):
    total_products: int
    total_orders: int
    total_users: int
    total_revenue: float
    pending_orders: int
