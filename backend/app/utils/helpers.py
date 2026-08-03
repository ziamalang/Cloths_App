import uuid
from datetime import datetime


def generate_order_number() -> str:
    return f"ZC-{datetime.utcnow().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"


def generate_tracking_number() -> str:
    return f"TRK{uuid.uuid4().hex[:10].upper()}"
