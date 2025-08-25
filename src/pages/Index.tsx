import { useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

interface User {
  role: string;
  municipality: string;
  name: string;
  permissions: string[];
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return <DashboardLayout user={user} onLogout={handleLogout} />;
};

export default Index;
