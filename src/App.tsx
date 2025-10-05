import {
  Route,
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Users from "./pages/Users";
import Dashboard from "./pages/Dashboard";
import RootLayout from "./layouts/RootLayout";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="users" element={<Users />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
