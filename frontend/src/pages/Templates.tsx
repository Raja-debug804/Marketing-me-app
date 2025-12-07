export default function Templates() {
  return (
    <div>
      <h2>Notification Templates</h2>
      <form>
        <input placeholder="Template name" />
        <textarea placeholder="Body e.g. Hi {{customer_name}}"></textarea>
        <label><input type="checkbox" /> Set as default</label>
        <button type="button">Save template</button>
      </form>
    </div>
  )
}
