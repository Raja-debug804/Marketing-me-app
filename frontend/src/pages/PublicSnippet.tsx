export default function PublicSnippet() {
  return (
    <div className="content">
      <h2>Public Notify Me snippet</h2>
      <p>Embed this widget on your product page to collect WhatsApp notify-me requests.</p>
      <pre>
{`<script src="https://cdn.notifyinsights.com/widget.js"
        data-tenant-key="TENANT_PUBLIC_KEY">
</script>
<button id="notify-me-btn">Notify me on WhatsApp</button>
<script>
  const btn = document.querySelector('#notify-me-btn');
  btn.addEventListener('click', async () => {
    const payload = {
      tenant_slug: 'your-tenant-slug',
      product_id: 'sku-123',
      variant_id: 'variant-1',
      product_name: 'Product name',
      customer_name: 'Visitor',
      whatsapp_number: '+155555555'
    }
    await fetch('/api/v1/public/notify/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  });
</script>`}
      </pre>
    </div>
  )
}
