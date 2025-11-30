# accounts/models.py
from django.conf import settings
from django.db import models

class ClientUser(models.Model):
    ROLE_ADMIN = 'admin'
    ROLE_STAFF = 'staff'
    ROLE_CHOICES = [
        (ROLE_ADMIN, 'Admin'),
        (ROLE_STAFF, 'Staff'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    client = models.ForeignKey('clients.Client', on_delete=models.CASCADE, null=True, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ROLE_STAFF)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'client')
        verbose_name = 'Client User'
        verbose_name_plural = 'Client Users'

    def __str__(self) -> str:
        return f"{self.user} -> {self.client or 'platform'} ({self.role})"

    @property
    def is_client_admin(self) -> bool:
        return self.role == self.ROLE_ADMIN
