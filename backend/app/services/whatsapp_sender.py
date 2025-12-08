import logging

logger = logging.getLogger(__name__)


class WhatsAppService:
    """
    Placeholder for WhatsApp Business API integration.
    In production, integrate with WhatsApp Business API or Twilio.
    """

    def __init__(self, api_key: str, api_url: str = "https://api.whatsapp.com"):
        self.api_key = api_key
        self.api_url = api_url

    async def send_message(self, to: str, message: str) -> bool:
        # TODO: Implement real WhatsApp API call
        logger.info("Sending WhatsApp to %s: %s", to, message)
        return True


# Global instance for backward compatibility
whatsapp_service = WhatsAppService(api_key="placeholder")


def send_whatsapp_message(to: str, message: str) -> bool:
    return whatsapp_service.send_message(to, message)
