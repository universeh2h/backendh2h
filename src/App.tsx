import { AuthProvider, ProtectedRoute } from "./components/authProvider";
import Component from "./components/main";
import { ProviderComponent } from "./components/provider";

export default function App() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <ProviderComponent>
          <Component />
        </ProviderComponent>
      </ProtectedRoute>
    </AuthProvider>
  );
}
