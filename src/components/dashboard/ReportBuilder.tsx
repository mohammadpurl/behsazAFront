import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Database, 
  FileText, 
  Download, 
  Play,
  Code,
  BarChart3,
  Table,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";

interface User {
  role: string;
  municipality: string;
  name: string;
  permissions: string[];
}

interface ReportBuilderProps {
  user: User;
}

const ReportBuilder = ({ user }: ReportBuilderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [outputFormat, setOutputFormat] = useState("");

  const handleExecuteQuery = async () => {
    setIsLoading(true);
    // Simulate query execution
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const queryTemplates = [
    {
      id: "revenue_3years",
      title: "پیش‌بینی درآمد ۳ ساله",
      description: "درآمد شهرداری برای سه سال آینده",
      query: `SELECT 
  year,
  SUM(revenue) as total_revenue,
  category
FROM municipal_revenue 
WHERE municipality_id = ?
  AND year BETWEEN 2024 AND 2026
GROUP BY year, category
ORDER BY year;`
    },
    {
      id: "population_growth",
      title: "رشد جمعیت",
      description: "تحلیل رشد جمعیت شهری",
      query: `SELECT 
  year,
  population,
  growth_rate
FROM population_data 
WHERE city_id = ?
ORDER BY year DESC;`
    },
    {
      id: "construction_permits",
      title: "مجوزهای ساخت‌وساز",
      description: "آمار مجوزهای صادر شده",
      query: `SELECT 
  DATE_FORMAT(issue_date, '%Y-%m') as month,
  COUNT(*) as permits_count,
  SUM(area) as total_area
FROM construction_permits 
WHERE municipality_id = ?
  AND issue_date >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
GROUP BY month
ORDER BY month;`
    }
  ];

  const recentReports = [
    {
      id: 1,
      title: "گزارش درآمد ماهانه",
      status: "completed",
      createdAt: "1403/08/15",
      format: "Excel",
      size: "2.1 MB"
    },
    {
      id: 2,
      title: "آمار جمعیتی مناطق شهری",
      status: "processing",
      createdAt: "1403/08/14",
      format: "JSON",
      size: "-"
    },
    {
      id: 3,
      title: "تحلیل مجوزهای ساخت‌وساز",
      status: "failed",
      createdAt: "1403/08/13",
      format: "XML",
      size: "-"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "default";
      case "processing": return "secondary";
      case "failed": return "destructive";
      default: return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-3 h-3" />;
      case "processing": return <Clock className="w-3 h-3" />;
      case "failed": return <AlertTriangle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed": return "تکمیل شده";
      case "processing": return "در حال پردازش";
      case "failed": return "خطا";
      default: return "نامشخص";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold persian-text">سازنده گزارش</h2>
        <p className="text-muted-foreground persian-text">
          ایجاد گزارش‌های تخصصی از پایگاه داده شهری
        </p>
      </div>

      <Tabs defaultValue="builder" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="builder" className="persian-text">سازنده گزارش</TabsTrigger>
          <TabsTrigger value="templates" className="persian-text">قالب‌های آماده</TabsTrigger>
          <TabsTrigger value="history" className="persian-text">سابقه گزارش‌ها</TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Query Builder */}
            <Card className="municipal-card">
              <CardHeader>
                <CardTitle className="persian-text">سازنده کوئری</CardTitle>
                <CardDescription className="persian-text">
                  کوئری SQL خود را وارد کنید
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium persian-text">کوئری SQL</label>
                  <Textarea
                    placeholder="SELECT * FROM ..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="min-h-40 font-mono text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium persian-text">فرمت خروجی</label>
                    <Select value={outputFormat} onValueChange={setOutputFormat}>
                      <SelectTrigger className="persian-text text-right">
                        <SelectValue placeholder="انتخاب فرمت" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="xml">XML</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium persian-text">نوع نمایش</label>
                    <Select>
                      <SelectTrigger className="persian-text text-right">
                        <SelectValue placeholder="انتخاب نمایش" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="table">جدول</SelectItem>
                        <SelectItem value="chart">نمودار</SelectItem>
                        <SelectItem value="both">هر دو</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={handleExecuteQuery}
                  disabled={isLoading || !query.trim()}
                  className="w-full"
                  variant="municipal"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin ml-2" />
                      <span className="persian-text">در حال اجرا...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 ml-2" />
                      <span className="persian-text">اجرای کوئری</span>
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Query Help */}
            <Card className="municipal-card">
              <CardHeader>
                <CardTitle className="persian-text">راهنمای کوئری</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <h4 className="font-medium persian-text text-sm">جداول در دسترس</h4>
                    <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                      <li>• municipal_revenue - درآمدهای شهرداری</li>
                      <li>• population_data - داده‌های جمعیتی</li>
                      <li>• construction_permits - مجوزهای ساخت</li>
                      <li>• traffic_data - داده‌های ترافیک</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-muted/30 rounded-lg">
                    <h4 className="font-medium persian-text text-sm">نکات امنیتی</h4>
                    <ul className="text-xs text-muted-foreground mt-2 space-y-1 persian-text">
                      <li>• از پارامترهای ? استفاده کنید</li>
                      <li>• کوئری‌های DELETE مجاز نیست</li>
                      <li>• حداکثر 10000 رکورد</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {queryTemplates.map((template) => (
              <Card key={template.id} className="municipal-card cursor-pointer group">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Code className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base persian-text">{template.title}</CardTitle>
                      <CardDescription className="persian-text text-sm">
                        {template.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-muted/30 p-3 rounded overflow-auto">
                    {template.query}
                  </pre>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-3 persian-text"
                    onClick={() => setQuery(template.query)}
                  >
                    استفاده از این قالب
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="grid gap-4">
            {recentReports.map((report) => (
              <Card key={report.id} className="municipal-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold persian-text">{report.title}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span className="persian-text">{report.createdAt}</span>
                          <Badge variant="outline">{report.format}</Badge>
                          {report.size !== "-" && <span>{report.size}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant={getStatusColor(report.status)}>
                        {getStatusIcon(report.status)}
                        <span className="persian-text mr-1">{getStatusText(report.status)}</span>
                      </Badge>
                      
                      {report.status === "completed" && (
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportBuilder;