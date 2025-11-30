# accounts/mixins.py
from typing import Optional
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.exceptions import PermissionDenied
from django.db.models import QuerySet
from clients.models import Client
from accounts.models import ClientUser

class ClientScopedQuerysetMixin(LoginRequiredMixin):
    client_field = 'client'

    def get_client(self) -> Optional[Client]:
        try:
            mapping = ClientUser.objects.get(user=self.request.user)
            return mapping.client
        except ClientUser.DoesNotExist:
            return None

    def filter_by_client(self, qs: QuerySet):
        client = self.get_client()
        if client:
            return qs.filter(**{self.client_field: client})
        if self.request.user.is_superuser:
            return qs
        raise PermissionDenied("No client scope assigned")
