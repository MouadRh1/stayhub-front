import { createBrowserRouter } from "react-router";
import { RootLayout } from "./layouts/RootLayout";
import { HomePage } from "./pages/HomePage";
import { SearchPage } from "./pages/SearchPage";
import { PropertyDetailPage } from "./pages/PropertyDetailPage";
import { UserDashboard } from "./pages/UserDashboard";
import { OwnerDashboard } from "./pages/OwnerDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { NotFoundPage } from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "search", Component: SearchPage },
      { path: "property/:id", Component: PropertyDetailPage },
      { path: "dashboard/user", Component: UserDashboard },
      { path: "dashboard/owner", Component: OwnerDashboard },
      { path: "dashboard/admin", Component: AdminDashboard },
      { path: "*", Component: NotFoundPage },
    ],
  },
]);
