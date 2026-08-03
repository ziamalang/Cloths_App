import stripe

from app.config import settings

stripe.api_key = settings.STRIPE_SECRET_KEY


def create_payment_intent(amount_pkr: float, order_number: str) -> dict:
    """Create Stripe payment intent. Amount converted to paisa (PKR * 100)."""
    if not settings.STRIPE_SECRET_KEY:
        return {
            "client_secret": "mock_secret_for_development",
            "payment_intent_id": f"mock_pi_{order_number}",
            "mock": True,
        }

    intent = stripe.PaymentIntent.create(
        amount=int(amount_pkr * 100),
        currency="pkr",
        metadata={"order_number": order_number},
        automatic_payment_methods={"enabled": True},
    )
    return {
        "client_secret": intent.client_secret,
        "payment_intent_id": intent.id,
        "mock": False,
    }


def verify_payment(payment_intent_id: str) -> bool:
    if not settings.STRIPE_SECRET_KEY or payment_intent_id.startswith("mock_pi_"):
        return True

    intent = stripe.PaymentIntent.retrieve(payment_intent_id)
    return intent.status == "succeeded"
