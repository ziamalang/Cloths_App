from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.config import settings
from app.utils.security import hash_password

engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {},
    pool_pre_ping=True,
    pool_recycle=3600,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def seed_demo_data() -> None:
    from app.models import Category, Product, User, UserRole

    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if not db.query(User).filter(User.email == "admin@ziacloths.com").first():
            db.add(
                User(
                    email="admin@ziacloths.com",
                    password_hash=hash_password("admin123"),
                    first_name="Zia",
                    last_name="Admin",
                    role=UserRole.admin,
                )
            )

        categories = {
            "men": {"name": "Men", "slug": "men", "description": "Street-ready premium basics for men."},
            "women": {"name": "Women", "slug": "women", "description": "Elegant tailoring and essential silhouettes for women."},
            "kids": {"name": "Kids", "slug": "kids", "description": "Comfort-first playful looks for kids."},
        }

        for slug, payload in categories.items():
            if not db.query(Category).filter(Category.slug == slug).first():
                db.add(Category(**payload, is_active=True))

        product_seed = [
            {
                "category_id": 1,
                "name": "Saffron Essentials Tee",
                "slug": "saffron-essentials-tee",
                "description": "Soft daily essentials, built for movement and suited to a laid-back premium wardrobe.",
                "price": 2400,
                "compare_price": 3200,
                "stock": 16,
                "image_url": "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80",
                "images": [
                    "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80",
                    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80",
                    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
                ],
                "colors": ["Saffron", "Graphite", "Navy"],
                "tag": "Men",
                "is_featured": True,
            },
            {
                "category_id": 2,
                "name": "Signature Overshirt",
                "slug": "signature-overshirt",
                "description": "A premium overshirt shaped for everyday layering with a clean silhouette and breathable finish.",
                "price": 5200,
                "compare_price": 6800,
                "stock": 12,
                "image_url": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
                "images": [
                    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
                    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
                    "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
                ],
                "colors": ["Cream", "Forest", "Charcoal"],
                "tag": "Best Seller",
                "is_featured": True,
            },
            {
                "category_id": 2,
                "name": "Runway Luxe Dress",
                "slug": "runway-luxe-dress",
                "description": "Elegant minimalism with a polished finish that elevates statement styling across the day.",
                "price": 6100,
                "compare_price": 7600,
                "stock": 5,
                "image_url": "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
                "images": [
                    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
                    "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
                    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
                ],
                "colors": ["Rose", "Pearl", "Midnight"],
                "tag": "Limited",
                "is_featured": True,
            },
            {
                "category_id": 3,
                "name": "Kids Canvas Summer Set",
                "slug": "kids-canvas-summer-set",
                "description": "Lightweight comfort with playful detailing and quick-day styling for little wardrobes.",
                "price": 2900,
                "compare_price": 3500,
                "stock": 18,
                "image_url": "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=900&q=80",
                "images": [
                    "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=900&q=80",
                    "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=900&q=80",
                    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
                ],
                "colors": ["Sky", "Mint", "Sun"],
                "tag": "Kids",
                "is_featured": True,
            },
        ]

        for item in product_seed:
            existing = db.query(Product).filter(Product.slug == item["slug"]).first()
            if not existing:
                db.add(Product(**item))

        db.commit()
    finally:
        db.close()


seed_demo_data()
