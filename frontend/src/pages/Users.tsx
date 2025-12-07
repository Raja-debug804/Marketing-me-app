const users = [
  { email: 'admin@tenant.com', role: 'TENANT_ADMIN' },
  { email: 'analyst@tenant.com', role: 'ANALYST' }
]

export default function Users() {
  return (
    <div>
      <h2>Tenant Users</h2>
      <table>
        <thead><tr><th>Email</th><th>Role</th></tr></thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.email}><td>{u.email}</td><td>{u.role}</td></tr>
          ))}
        </tbody>
      </table>
      <h3>Add user</h3>
      <form>
        <input placeholder="Email" />
        <input placeholder="Full name" />
        <select>
          <option value="TENANT_ADMIN">Tenant Admin</option>
          <option value="MANAGER">Manager</option>
          <option value="ANALYST">Analyst</option>
        </select>
        <input placeholder="Password" type="password" />
        <button type="button">Invite</button>
      </form>
    </div>
  )
}
