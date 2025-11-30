# subscriptions/serializers.py
from rest_framework import serializers
from clients.models import Client, StoreIntegration
from catalog.models import Product, ProductVariant
from .models import NotifySubscription

class NotifySubscriptionSerializer(serializers.ModelSerializer):
    client_code = serializers.CharField(write_only=True, required=False)
    store_domain = serializers.CharField(write_only=True, required=False)
    external_product_id = serializers.CharField(write_only=True)
    external_variant_id = serializers.CharField(write_only=True, required=False, allow_blank=True)
    whatsapp_number = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = NotifySubscription
        fields = [
            'client',
            'integration',
            'product',
            'variant',
            'customer_whatsapp_number',
            'customer_name',
            'status',
            'client_code',
            'store_domain',
            'external_product_id',
            'external_variant_id',
            'whatsapp_number',
        ]
        read_only_fields = ['status', 'client', 'integration', 'product', 'variant']

    def validate(self, attrs):
        client_code = attrs.pop('client_code', None)
        store_domain = attrs.pop('store_domain', None)
        ext_product_id = attrs.pop('external_product_id', None)
        ext_variant_id = attrs.pop('external_variant_id', None)
        provided_number = attrs.pop('whatsapp_number', None)

        if provided_number:
            attrs['customer_whatsapp_number'] = provided_number

        try:
            if client_code:
                client = Client.objects.get(slug=client_code)
            else:
                integration = StoreIntegration.objects.get(shop_domain=store_domain)
                client = integration.client
        except (Client.DoesNotExist, StoreIntegration.DoesNotExist) as exc:
            raise serializers.ValidationError('Client or integration not found') from exc

        integration = integration if 'integration' in locals() else client.integrations.first()
        if not integration:
            raise serializers.ValidationError('Integration not configured for client')

        try:
            product = Product.objects.get(client=client, external_product_id=ext_product_id)
        except Product.DoesNotExist as exc:
            raise serializers.ValidationError('Product not found') from exc

        variant = None
        if ext_variant_id:
            variant = ProductVariant.objects.filter(product=product, external_variant_id=ext_variant_id).first()

        attrs['client'] = client
        attrs['integration'] = integration
        attrs['product'] = product
        attrs['variant'] = variant
        return attrs
