import { createBrowserRouter } from "react-router-dom";
import Login from "./Pages/Login";
import Employees from "./Pages/Employees";
import ErrorPage from "./Pages/ErrorPage";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/employees", element: <Employees /> },
  { path: "/employees/:employeeID", element: <Employees /> },
  { path: "*", element: <ErrorPage /> },
]);

export default router;
