from app.models.notify import NotifySubscription


def test_subscription_has_tenant_id_field():
    assert hasattr(NotifySubscription, "tenant_id")
