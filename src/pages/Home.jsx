export default function Home({ session }) {
  return (
    <div>
      <h1>Welcome</h1>

      {!session ? (
        <p>Welcome — please log in or create a dashboard.</p>
      ) : (
        <p>
          You are logged in. Use the navigation bar to access your dashboards or
          return here via the menu.
        </p>
      )}
    </div>
  );
}
