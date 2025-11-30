# clients/models.py
from django.db import models
from django.utils.text import slugify

class Client(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.name

class StoreIntegration(models.Model):
    PLATFORM_SHOPIFY = 'shopify'
    PLATFORM_CUSTOM = 'custom'
    PLATFORM_CHOICES = [
        (PLATFORM_SHOPIFY, 'Shopify'),
        (PLATFORM_CUSTOM, 'Custom'),
    ]

    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='integrations')
    platform = models.CharField(max_length=50, choices=PLATFORM_CHOICES)
    shop_domain = models.CharField(max_length=255)
    api_key = models.CharField(max_length=255)
    api_secret = models.CharField(max_length=255)
    webhook_secret = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('client', 'shop_domain')

    def __str__(self) -> str:
        return f"{self.client.name} - {self.platform} ({self.shop_domain})"
