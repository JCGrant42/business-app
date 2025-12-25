import { Link } from "react-router-dom";

export default function NoAccess() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Access Denied</h1>
      <p>You do not have access to this dashboard.</p>

      <Link to="/">Go to Home</Link>
    </div>
  );
}
