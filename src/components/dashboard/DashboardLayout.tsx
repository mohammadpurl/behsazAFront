import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  LogOut, 
  MessageCircle, 
  FileText, 
  TrendingUp, 
  Database, 
  Upload,
  Settings,
  Users,
  Shield,
  BarChart3,
  Brain,
  Building2,
  Globe
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DocumentManager from "./DocumentManager";
import PredictionModule from "./PredictionModule";
import ReportBuilder from "./ReportBuilder";

interface User {
  role: string;
  municipality: string;
  name: string;
  permissions: string[];
}

interface DashboardLayoutProps {
  user: User;
  onLogout: () => void;
}

const DashboardLayout = ({ user, onLogout }: DashboardLayoutProps) => {
  const [activeModule, setActiveModule] = useState("overview");
  const navigate = useNavigate();

  const modules = [
    {
      id: "overview",
      title: "داشبورد اصلی",
      icon: BarChart3,
      description: "نمای کلی سامانه",
      permission: true
    },
    {
      id: "chat",
      title: "چت با هوش مصنوعی",
      icon: MessageCircle,
      description: "پرسش از اسناد بارگذاری شده",
      permission: true
    },
    {
      id: "documents",
      title: "مدیریت اسناد",
      icon: FileText,
      description: "آپلود و مدیریت مستندات",
      permission: user.permissions.includes("documents")
    },
    {
      id: "predictions",
      title: "پیش‌بینی و تحلیل",
      icon: TrendingUp,
      description: "پیش‌بینی‌های شهری",
      permission: user.permissions.includes("predictions")
    },
    {
      id: "reports",
      title: "گزارش‌ساز",
      icon: Database,
      description: "ایجاد گزارش‌های تخصصی",
      permission: user.permissions.includes("reports")
    },
    {
      id: "users",
      title: "مدیریت کاربران",
      icon: Users,
      description: "مدیریت دسترسی‌ها",
      permission: user.permissions.includes("users")
    }
  ];

  const availableModules = modules.filter(module => module.permission);

  const renderActiveModule = () => {
    switch (activeModule) {
      case "chat":
        navigate("/chat");
        return null;
      case "documents":
        return <DocumentManager user={user} />;
      case "predictions":
        return <PredictionModule user={user} />;
      case "reports":
        return <ReportBuilder user={user} />;
      case "users":
        return <div className="text-center text-muted-foreground persian-text py-20">بخش مدیریت کاربران در حال توسعه</div>;
      default:
        return <OverviewModule user={user} modules={availableModules} />;
    }
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center municipal-glow">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold municipal-gradient-text persian-text">
                  سامانه هوش مصنوعی شهری
                </h1>
                <p className="text-sm text-muted-foreground persian-text">
                  {user.municipality} - {user.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant={user.role === "admin" ? "destructive" : user.role === "manager" ? "default" : "secondary"}>
                <Shield className="w-3 h-3 mr-1" />
                <span className="persian-text">{user.role}</span>
              </Badge>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4 ml-2" />
                <span className="persian-text">خروج</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div className="w-80 flex-shrink-0 border-l border-border">
          <Card className="municipal-card h-full rounded-none border-0 border-l">
            <CardHeader>
              <CardTitle className="persian-text text-lg">ماژول‌های سامانه</CardTitle>
              <CardDescription className="persian-text">
                بخش‌های در دسترس شما
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {availableModules.map((module) => {
                const Icon = module.icon;
                const isActive = activeModule === module.id;
                
                return (
                  <Button
                    key={module.id}
                    variant={isActive ? "default" : "ghost"}
                    className="w-full justify-start persian-text"
                    onClick={() => setActiveModule(module.id)}
                  >
                    <Icon className="w-4 h-4 ml-3" />
                    {module.title}
                  </Button>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-6">
            {renderActiveModule()}
          </div>
        </div>
      </div>
    </div>
  );
};

const OverviewModule = ({ user, modules }: { user: User; modules: any[] }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold persian-text mb-2">داشبورد اصلی</h2>
        <p className="text-muted-foreground persian-text">
          خوش آمدید به سامانه هوش مصنوعی شهری. از طریق ماژول‌های زیر می‌توانید با سامانه کار کنید.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modules.slice(1).map((module) => {
          const Icon = module.icon;
          return (
            <Card key={module.id} className="municipal-card cursor-pointer group">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="persian-text">{module.title}</CardTitle>
                    <CardDescription className="persian-text">
                      {module.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="municipal-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">1,247</p>
                <p className="text-sm text-muted-foreground persian-text">پرسش‌های امروز</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="municipal-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">89%</p>
                <p className="text-sm text-muted-foreground persian-text">دقت پاسخ‌ها</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="municipal-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">24/7</p>
                <p className="text-sm text-muted-foreground persian-text">آنلاین</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardLayout;