function ErrorPage() {
  return (
    <div className="text-center mt-10">
      <h1>404</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <a href="/employees" className="text-blue-500">
        Go back to Employees
      </a>
    </div>
  );
}

export default ErrorPage;
