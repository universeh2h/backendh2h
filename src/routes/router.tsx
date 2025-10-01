import App from "@/App";
import { AuthProvider } from "@/components/authProvider";
import LoginPage from "@/components/login";
import { ProviderComponent } from "@/components/provider";
import AnalyticsPage from "@/pages/Analytics";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: (
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    ),
  },
  {
    path: "/analytics",
    element: (
      <ProviderComponent>
        <AnalyticsPage />
      </ProviderComponent>
    ),
  },
]);
