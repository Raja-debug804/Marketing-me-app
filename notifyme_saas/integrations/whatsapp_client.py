# integrations/whatsapp_client.py
import logging
import requests

logger = logging.getLogger(__name__)

class WhatsAppClient:
    """Thin wrapper around WhatsApp provider (Meta Cloud API placeholder)."""

    def __init__(self, token: str | None = None, phone_number_id: str | None = None):
        self.base_url = 'https://graph.facebook.com/v18.0'
        self.token = token or 'DEMO_TOKEN'
        self.phone_number_id = phone_number_id or 'PHONE_NUMBER_ID'

    def send_message(self, to: str, message: str) -> dict:
        url = f"{self.base_url}/{self.phone_number_id}/messages"
        payload = {
            'messaging_product': 'whatsapp',
            'to': to,
            'type': 'text',
            'text': {'body': message},
        }
        headers = {'Authorization': f'Bearer {self.token}'}
        logger.info('Sending WhatsApp message to %s', to)
        # For the MVP we won't actually call out; stub a response
        try:
            # response = requests.post(url, json=payload, headers=headers, timeout=10)
            # response.raise_for_status()
            # return response.json()
            return {'messages': [{'id': 'demo-message-id'}], 'payload': payload, 'url': url}
        except requests.RequestException as exc:  # pragma: no cover
            logger.exception('WhatsApp send failure')
            raise exc
