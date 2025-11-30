# subscriptions/views.py
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.db import transaction

from .models import NotifySubscription
from .serializers import NotifySubscriptionSerializer


class NotifySubscribeView(APIView):
    permission_classes = [AllowAny]

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        serializer = NotifySubscriptionSerializer(data=request.data)
        if serializer.is_valid():
            subscription: NotifySubscription = serializer.save()
            return Response({'status': 'ok', 'subscription_id': subscription.id})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
