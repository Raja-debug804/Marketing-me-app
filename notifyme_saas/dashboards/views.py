# dashboards/views.py
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.views.generic import TemplateView

from accounts.mixins import ClientScopedQuerysetMixin
from clients.models import Client
from catalog.models import Product
from subscriptions.models import NotifySubscription, WhatsAppMessageLog


class ClientDashboardView(ClientScopedQuerysetMixin, TemplateView):
    template_name = 'dashboards/client_dashboard.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        client = self.get_client()
        subscriptions = self.filter_by_client(NotifySubscription.objects.all())
        context.update({
            'client': client,
            'products': self.filter_by_client(Product.objects.all()),
            'subscriptions': subscriptions.select_related('product', 'variant'),
            'total_subscriptions': subscriptions.count(),
            'total_notified': subscriptions.filter(status=NotifySubscription.STATUS_NOTIFIED).count(),
            'total_pending': subscriptions.filter(status=NotifySubscription.STATUS_PENDING).count(),
        })
        return context


class PlatformAdminDashboardView(UserPassesTestMixin, LoginRequiredMixin, TemplateView):
    template_name = 'dashboards/admin_dashboard.html'

    def test_func(self):
        return self.request.user.is_superuser

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['clients'] = Client.objects.all()
        context['subscriptions'] = NotifySubscription.objects.select_related('client')
        context['whatsapp_logs'] = WhatsAppMessageLog.objects.select_related('client')[:50]
        return context
