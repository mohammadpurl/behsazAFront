import LoginForm from "@/components/auth/LoginForm";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user, login, logout } = useAuth();

  if (!user) {
    return <LoginForm onLogin={login} />;
  }

  return <DashboardLayout user={user} onLogout={logout} />;
};

export default Index;
