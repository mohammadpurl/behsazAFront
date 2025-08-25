import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Search,
  Filter,
  Download,
  Eye,
  Edit3,
  Trash2
} from "lucide-react";

interface User {
  role: string;
  municipality: string;
  name: string;
  permissions: string[];
}

interface DocumentManagerProps {
  user: User;
}

const DocumentManager = ({ user }: DocumentManagerProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock documents data
  const documents = [
    {
      id: 1,
      title: "راهنمای سامانه مالی شهرداری",
      version: "2.1.0",
      status: "active",
      uploadDate: "1403/08/15",
      size: "2.4 MB",
      type: "PDF",
      category: "مالی"
    },
    {
      id: 2,
      title: "قوانین شهرسازی و نظام‌نامه‌ها",
      version: "1.8.3",
      status: "pending",
      uploadDate: "1403/08/12",
      size: "5.1 MB",
      type: "PDF",
      category: "حقوقی"
    },
    {
      id: 3,
      title: "مستندات API سامانه‌های شهری",
      version: "3.0.1",
      status: "active",
      uploadDate: "1403/08/10",
      size: "1.8 MB",
      type: "PDF",
      category: "فنی"
    },
    {
      id: 4,
      title: "راهنمای عملیاتی خدمات شهری",
      version: "1.5.2",
      status: "outdated",
      uploadDate: "1403/07/28",
      size: "3.2 MB",
      type: "PDF",
      category: "عملیاتی"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "pending": return "secondary";
      case "outdated": return "destructive";
      default: return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="w-3 h-3" />;
      case "pending": return <Clock className="w-3 h-3" />;
      case "outdated": return <AlertCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "فعال";
      case "pending": return "در انتظار";
      case "outdated": return "منسوخ";
      default: return "نامشخص";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold persian-text">مدیریت اسناد</h2>
          <p className="text-muted-foreground persian-text">
            مدیریت مستندات و منابع آموزشی سامانه
          </p>
        </div>
        {user.permissions.includes("documents") && (
          <Button variant="municipal">
            <Upload className="w-4 h-4 ml-2" />
            <span className="persian-text">آپلود سند جدید</span>
          </Button>
        )}
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="persian-text">همه اسناد</TabsTrigger>
          <TabsTrigger value="active" className="persian-text">فعال</TabsTrigger>
          <TabsTrigger value="pending" className="persian-text">در انتظار</TabsTrigger>
          <TabsTrigger value="outdated" className="persian-text">منسوخ</TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="جستجو در اسناد..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 persian-text text-right"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 ml-2" />
            <span className="persian-text">فیلتر</span>
          </Button>
        </div>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
            {documents.map((doc) => (
              <Card key={doc.id} className="municipal-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold persian-text">{doc.title}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span className="persian-text">نسخه {doc.version}</span>
                          <span className="persian-text">{doc.uploadDate}</span>
                          <span>{doc.size}</span>
                          <Badge variant="outline" className="persian-text">{doc.category}</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant={getStatusColor(doc.status)}>
                        {getStatusIcon(doc.status)}
                        <span className="persian-text mr-1">{getStatusText(doc.status)}</span>
                      </Badge>
                      
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                        {user.permissions.includes("documents") && (
                          <>
                            <Button variant="ghost" size="sm">
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Other tab contents would be similar but filtered */}
        <TabsContent value="active">
          <div className="text-center text-muted-foreground persian-text py-20">
            اسناد فعال ({documents.filter(d => d.status === "active").length})
          </div>
        </TabsContent>

        <TabsContent value="pending">
          <div className="text-center text-muted-foreground persian-text py-20">
            اسناد در انتظار تایید ({documents.filter(d => d.status === "pending").length})
          </div>
        </TabsContent>

        <TabsContent value="outdated">
          <div className="text-center text-muted-foreground persian-text py-20">
            اسناد منسوخ ({documents.filter(d => d.status === "outdated").length})
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentManager;
