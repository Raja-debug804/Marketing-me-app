import logging

logger = logging.getLogger(__name__)


def send_whatsapp_message(to: str, message: str) -> bool:
    logger.info("Sending WhatsApp to %s: %s", to, message)
    return True
