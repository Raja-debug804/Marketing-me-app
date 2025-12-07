export default function Rules() {
  return (
    <div>
      <h2>Notification Rules</h2>
      <form>
        <select>
          <option value="BACK_IN_STOCK">Back in stock</option>
          <option value="LOW_STOCK">Low stock</option>
          <option value="PRICE_DROP">Price drop</option>
        </select>
        <input placeholder="Template ID" />
        <input placeholder="UTM Source" defaultValue="notifyinsights" />
        <input placeholder="UTM Medium" defaultValue="whatsapp" />
        <input placeholder="UTM Campaign" defaultValue="back_in_stock" />
        <input placeholder="Send window start (HH:MM)" />
        <input placeholder="Send window end (HH:MM)" />
        <label><input type="checkbox" defaultChecked /> Active</label>
        <button type="button">Save rule</button>
      </form>
    </div>
  )
}
