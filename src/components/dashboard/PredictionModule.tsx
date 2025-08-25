import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  BarChart3, 
  Users, 
  Building, 
  DollarSign,
  Calendar,
  MapPin,
  Download,
  Send,
  Loader2,
  Brain
} from "lucide-react";

interface User {
  role: string;
  municipality: string;
  name: string;
  permissions: string[];
}

interface PredictionModuleProps {
  user: User;
}

const PredictionModule = ({ user }: PredictionModuleProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleSubmit = async () => {
    setIsLoading(true);
    // Simulate AI processing
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  const predictionCategories = [
    { id: "population", name: "پیش‌بینی جمعیت", icon: Users },
    { id: "revenue", name: "پیش‌بینی درآمد", icon: DollarSign },
    { id: "construction", name: "پیش‌بینی ساخت‌وساز", icon: Building },
    { id: "traffic", name: "پیش‌بینی ترافیک", icon: BarChart3 }
  ];

  const mockResults = [
    {
      title: "پیش‌بینی درآمد شهرداری تهران - سه سال آینده",
      date: "1403/08/15",
      format: "Excel",
      status: "completed"
    },
    {
      title: "تحلیل رشد جمعیت منطقه 22 تهران",
      date: "1403/08/12",
      format: "JSON",
      status: "processing"
    },
    {
      title: "پیش‌بینی نیاز به مسکن در اصفهان",
      date: "1403/08/10",
      format: "XML",
      status: "completed"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold persian-text">پیش‌بینی و تحلیل شهری</h2>
        <p className="text-muted-foreground persian-text">
          ایجاد پیش‌بینی‌ها و تحلیل‌های هوشمند برای مدیریت شهری
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="space-y-4">
          <Card className="municipal-card">
            <CardHeader>
              <CardTitle className="persian-text">درخواست تحلیل جدید</CardTitle>
              <CardDescription className="persian-text">
                سوال یا درخواست تحلیل خود را وارد کنید
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium persian-text">انتخاب شهر</label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="persian-text text-right">
                    <SelectValue placeholder="شهر مورد نظر را انتخاب کنید" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tehran">تهران</SelectItem>
                    <SelectItem value="isfahan">اصفهان</SelectItem>
                    <SelectItem value="mashhad">مشهد</SelectItem>
                    <SelectItem value="shiraz">شیراز</SelectItem>
                    <SelectItem value="tabriz">تبریز</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium persian-text">دسته‌بندی تحلیل</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="persian-text text-right">
                    <SelectValue placeholder="نوع تحلیل را انتخاب کنید" />
                  </SelectTrigger>
                  <SelectContent>
                    {predictionCategories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium persian-text">سوال یا درخواست</label>
                <Textarea
                  placeholder="مثال: پیش‌بینی درآمد شهرداری برای سه سال آینده با تفکیک ساله..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-32 persian-text text-right"
                />
              </div>

              <Button 
                onClick={handleSubmit}
                disabled={isLoading || !prompt.trim()}
                className="w-full"
                variant="municipal"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin ml-2" />
                    <span className="persian-text">در حال پردازش...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 ml-2" />
                    <span className="persian-text">ارسال درخواست</span>
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Quick Categories */}
          <Card className="municipal-card">
            <CardHeader>
              <CardTitle className="persian-text">دسته‌های پرکاربرد</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {predictionCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Button
                      key={category.id}
                      variant="outline"
                      className="h-auto p-4 justify-start persian-text"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <Icon className="w-5 h-5 ml-3 text-primary" />
                      <span className="text-sm">{category.name}</span>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="space-y-4">
          <Card className="municipal-card">
            <CardHeader>
              <CardTitle className="persian-text">تحلیل‌های اخیر</CardTitle>
              <CardDescription className="persian-text">
                نتایج تحلیل‌های انجام شده
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Brain className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium persian-text text-sm">{result.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground persian-text">{result.date}</span>
                        <Badge variant="outline" className="text-xs">{result.format}</Badge>
                        <Badge 
                          variant={result.status === "completed" ? "default" : "secondary"}
                          className="text-xs persian-text"
                        >
                          {result.status === "completed" ? "تکمیل شده" : "در حال پردازش"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {result.status === "completed" && (
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="municipal-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-lg font-bold">47</p>
                    <p className="text-xs text-muted-foreground persian-text">تحلیل امروز</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="municipal-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-bold">1,234</p>
                    <p className="text-xs text-muted-foreground persian-text">کل تحلیل‌ها</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionModule;