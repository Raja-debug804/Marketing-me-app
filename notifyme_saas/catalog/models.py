# catalog/models.py
from django.db import models

class Product(models.Model):
    client = models.ForeignKey('clients.Client', on_delete=models.CASCADE, related_name='products')
    integration = models.ForeignKey('clients.StoreIntegration', on_delete=models.CASCADE, related_name='products')
    external_product_id = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    slug = models.SlugField()
    product_url = models.URLField()
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('client', 'external_product_id')
        ordering = ['name']

    def __str__(self) -> str:
        return self.name

class ProductVariant(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    external_variant_id = models.CharField(max_length=255)
    sku = models.CharField(max_length=100, blank=True)
    option_values = models.JSONField(default=dict, blank=True)

    class Meta:
        unique_together = ('product', 'external_variant_id')

    def __str__(self) -> str:
        return f"{self.product.name} - {self.sku or self.external_variant_id}"
