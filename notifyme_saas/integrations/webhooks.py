# integrations/webhooks.py
import base64
import hmac
import json
from hashlib import sha256

from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.views import APIView

from clients.models import StoreIntegration
from catalog.models import Product, ProductVariant
from subscriptions.models import InventoryEvent


def verify_shopify_signature(secret: str, body: bytes, header_hmac: str) -> bool:
    digest = hmac.new(secret.encode(), body, sha256).digest()
    computed = base64.b64encode(digest).decode()
    return hmac.compare_digest(computed, header_hmac)


@method_decorator(csrf_exempt, name='dispatch')
class ShopifyInventoryWebhook(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request, *args, **kwargs):
        shop_domain = request.META.get('HTTP_X_SHOPIFY_SHOP_DOMAIN')
        header_hmac = request.META.get('HTTP_X_SHOPIFY_HMAC_SHA256', '')
        raw_body = request.body

        try:
            integration = StoreIntegration.objects.get(shop_domain=shop_domain)
        except StoreIntegration.DoesNotExist:
            return HttpResponse(status=404)

        if not verify_shopify_signature(integration.webhook_secret, raw_body, header_hmac):
            return HttpResponse(status=401)

        payload = json.loads(raw_body.decode())
        product_id = str(payload.get('product_id'))
        variant_id = payload.get('variant_id')
        previous_qty = int(payload.get('previous_qty', 0))
        new_qty = int(payload.get('available', 0))

        try:
            product = Product.objects.get(external_product_id=product_id, client=integration.client)
        except Product.DoesNotExist:
            return HttpResponse(status=404)

        variant = None
        if variant_id:
            variant = ProductVariant.objects.filter(product=product, external_variant_id=str(variant_id)).first()

        InventoryEvent.objects.create(
            client=integration.client,
            product=product,
            variant=variant,
            previous_qty=previous_qty,
            new_qty=new_qty,
            event_source='shopify_webhook',
        )
        return JsonResponse({'status': 'received'})
