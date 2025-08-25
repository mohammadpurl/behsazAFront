import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Shield, Users, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LoginFormProps {
  onLogin: (userData: any) => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    municipality: ""
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Mock different user types for demo
      const mockUsers = {
        "admin": { role: "admin", municipality: "تهران", name: "مدیر سیستم", permissions: ["documents", "predictions", "reports", "users"] },
        "manager": { role: "manager", municipality: "اصفهان", name: "مدیر شهرداری", permissions: ["predictions", "reports"] },
        "operator": { role: "operator", municipality: "مشهد", name: "اپراتور", permissions: ["documents"] }
      };

      const user = mockUsers[credentials.username as keyof typeof mockUsers];
      
      if (user) {
        toast({
          title: "ورود موفقیت‌آمیز",
          description: `خوش آمدید ${user.name}`,
        });
        onLogin(user);
      } else {
        toast({
          title: "خطا در ورود",
          description: "نام کاربری یا رمز عبور اشتباه است",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4" dir="rtl">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
      
      <Card className="w-full max-w-md municipal-card relative z-10">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center municipal-glow">
            <Building2 className="w-8 h-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl municipal-gradient-text persian-text">
              سامانه هوش مصنوعی شهری
            </CardTitle>
            <CardDescription className="text-muted-foreground persian-text mt-2">
              برای ورود نام کاربری و رمز عبور خود را وارد کنید
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="persian-text">نام کاربری</Label>
              <Input
                id="username"
                type="text"
                placeholder="نام کاربری خود را وارد کنید"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                className="persian-text text-right"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="persian-text">رمز عبور</Label>
              <Input
                id="password"
                type="password"
                placeholder="رمز عبور خود را وارد کنید"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="persian-text text-right"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="municipality" className="persian-text">شهرداری</Label>
              <Input
                id="municipality"
                type="text"
                placeholder="نام شهرداری خود را وارد کنید"
                value={credentials.municipality}
                onChange={(e) => setCredentials({...credentials, municipality: e.target.value})}
                className="persian-text text-right"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              variant="municipal"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin ml-2" />}
              <span className="persian-text">ورود به سامانه</span>
            </Button>
          </form>

          <div className="pt-4 border-t border-border">
            <div className="text-center text-sm text-muted-foreground persian-text">
              <p className="mb-3">حساب‌های نمونه برای تست:</p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between bg-muted/30 p-2 rounded">
                  <span>admin / admin</span>
                  <Shield className="w-3 h-3 text-accent" />
                </div>
                <div className="flex items-center justify-between bg-muted/30 p-2 rounded">
                  <span>manager / manager</span>
                  <Users className="w-3 h-3 text-primary" />
                </div>
                <div className="flex items-center justify-between bg-muted/30 p-2 rounded">
                  <span>operator / operator</span>
                  <Building2 className="w-3 h-3 text-secondary" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;