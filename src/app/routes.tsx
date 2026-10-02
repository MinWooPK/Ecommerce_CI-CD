import { wrapCreateBrowserRouter } from "@sentry/react";
import { RouteErrorRecovery } from "../presentation/components/ErrorRecovery";
import { CartPage } from "../presentation/pages/CartPage";
import { createBrowserRouter } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";
import { ProtectedRoute } from "./router/ProtectedRoute";

import { HomePage } from "../presentation/pages/HomePage";
import { Login } from "../presentation/pages/Login";
import { RegisterPage } from "../presentation/pages/RegisterPage";
import { ProjectPage } from "../presentation/pages/ProjectPage";
import { TaskPage } from "../presentation/pages/TaskPage";
import { ShopPage } from "../presentation/pages/ShopPage";
import { ShopDetailPage } from "../presentation/pages/ShopDetailPage";
import { ProfilePage } from "../presentation/pages/ProfilePage";

export const routes = wrapCreateBrowserRouter(createBrowserRouter)([
  {
    path: "/login",
    errorElement: <RouteErrorRecovery />,
    element: <Login />,
  },
  {
    path: "/register",
    errorElement: <RouteErrorRecovery />,
    element: <RegisterPage />,
  },

  {
    element: <ProtectedRoute />,
    errorElement: <RouteErrorRecovery />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "/",
            element: <HomePage />,
          },
          {
            path: "/projects",
            element: <ProjectPage />,
          },
          {
            path: "/tasks",
            element: <TaskPage />,
          },
          {
            path: "/shop",
            element: <ShopPage />,
          },
          {
            path: "/profile",
            element: <ProfilePage />,
          },
          {
            path: "/shop/cart",
            element: <CartPage />,
          },
          {
            path: "/shop/:id",
            element: <ShopDetailPage />,
          },
        ],
      },
    ],
  },
]);
