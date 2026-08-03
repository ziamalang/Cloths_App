from fastapi import APIRouter

router = APIRouter(tags=["Dashboard"])


@router.get("/dashboard")
def get_dashboard_data():
    return {
        "stats": [
            {"label": "Collections", "value": "24"},
            {"label": "Active campaigns", "value": "8"},
            {"label": "API endpoints", "value": "18"},
        ],
        "updates": [
            "New collection assets synced to the admin dashboard",
            "API routes updated for faster product and campaign management",
            "Design review panel ready for the next launch",
        ],
        "collections": [
            {
                "id": 1,
                "title": "Monsoon Luxe",
                "tag": "New drop",
                "description": "Layered tailoring, rich neutrals, and elegant evening styling.",
                "image": "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
                "accent": "Neutral tailoring",
                "details": "A polished collection experience built for premium fashion launches and storytelling.",
                "stats": ["3 launch pages", "AI-ready promos", "Admin content sync"],
            },
            {
                "id": 2,
                "title": "Street Edit",
                "tag": "Editorial",
                "description": "Bold cuts and rich textures styled for city-ready confidence.",
                "image": "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
                "accent": "Deep contrast",
                "details": "Engaging editorial visuals tailored for modern storefronts and campaigns.",
                "stats": ["Responsive gallery", "Campaign CMS", "Analytics dashboard"],
            },
            {
                "id": 3,
                "title": "Runway Glow",
                "tag": "Limited",
                "description": "Statement pieces with a warm palette made for standout moments.",
                "image": "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
                "accent": "Warm statement",
                "details": "A launch-ready experience that combines fashion storytelling with full-stack infrastructure.",
                "stats": ["Fast API routes", "AI recommendations", "Brand dashboard"],
            },
        ],
    }
