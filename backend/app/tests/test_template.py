from app.services.notification_service import build_product_url, render_template


def test_build_product_url_appends_params():
    url = build_product_url("https://shop.com/item", "src", "med", "camp")
    assert "utm_source=src" in url
    assert "utm_medium=med" in url
    assert "utm_campaign=camp" in url


def test_render_template_replaces_placeholders():
    template = "Hi {{customer_name}}, {{product_name}} is live at {{product_url}}"
    rendered = render_template(
        template,
        {
            "customer_name": "Sam",
            "product_name": "Sneaker",
            "product_url": "https://shop.com",
        },
    )
    assert "Sam" in rendered and "Sneaker" in rendered
