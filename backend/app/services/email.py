import logging
from email.message import EmailMessage

import aiosmtplib

from app.config import settings

logger = logging.getLogger(__name__)


async def send_email(to: str, subject: str, body: str) -> bool:
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        logger.info("Email skipped (SMTP not configured): %s - %s", to, subject)
        return False

    message = EmailMessage()
    message["From"] = settings.SMTP_FROM
    message["To"] = to
    message["Subject"] = subject
    message.set_content(body)

    try:
        await aiosmtplib.send(
            message,
            hostname=settings.SMTP_HOST,
            port=settings.SMTP_PORT,
            username=settings.SMTP_USER,
            password=settings.SMTP_PASSWORD,
            start_tls=True,
        )
        return True
    except Exception as exc:
        logger.error("Failed to send email to %s: %s", to, exc)
        return False


async def send_order_confirmation(email: str, order_number: str, total: float) -> bool:
    body = f"""Hello,

Thank you for shopping at Zia Cloths!

Your order {order_number} has been placed successfully.
Total: PKR {total:,.2f}

We will notify you when your order ships.

Best regards,
Zia Cloths Team
"""
    return await send_email(email, f"Order Confirmation - {order_number}", body)


async def send_order_status_update(email: str, order_number: str, status: str, tracking: str | None = None) -> bool:
    tracking_line = f"\nTracking Number: {tracking}" if tracking else ""
    body = f"""Hello,

Your order {order_number} status has been updated to: {status.upper()}.{tracking_line}

Track your order at: {settings.FRONTEND_URL}/orders/{order_number}

Best regards,
Zia Cloths Team
"""
    return await send_email(email, f"Order Update - {order_number}", body)


async def send_welcome_email(email: str, name: str) -> bool:
    body = f"""Hello {name},

Welcome to Zia Cloths! Your account has been created successfully.

Start exploring our premium fashion collections today.

Best regards,
Zia Cloths Team
"""
    return await send_email(email, "Welcome to Zia Cloths", body)
