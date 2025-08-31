import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import LoginForm from "@/components/auth/LoginForm";
import axios from 'axios';
import { 
  Send, 
  Plus, 
  MessageCircle, 
  FileText, 
  Bot,
  User,
  ArrowRight,
  Clock,
  Building2,
  LogOut,
  Home
} from "lucide-react";

interface User {
  role: string;
  municipality: string;
  name: string;
  permissions: string[];
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  documents?: string[];
  search?: {
    question: string;
    answer: string;
  };
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

const ChatPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'پرسش درباره قوانین شهرسازی',
      lastMessage: 'قوانین مربوط به ساخت و ساز در مناطق مسکونی چگونه است؟',
      timestamp: new Date('2024-01-15T10:30:00'),
      messageCount: 12
    },
    {
      id: '2', 
      title: 'بودجه شهرداری 1403',
      lastMessage: 'درآمدهای شهرداری در سال آینده چقدر پیش‌بینی می‌شود؟',
      timestamp: new Date('2024-01-14T15:45:00'),
      messageCount: 8
    },
    {
      id: '3',
      title: 'مقررات زیست محیطی',
      lastMessage: 'آیا پروژه جدید نیاز به ارزیابی زیست محیطی دارد؟',
      timestamp: new Date('2024-01-13T09:20:00'),
      messageCount: 5
    }
  ]);

  const [activeConversationId, setActiveConversationId] = useState<string>('1');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'سلام! من دستیار هوش مصنوعی شما هستم. می‌توانید در مورد اسناد بارگذاری شده سوال بپرسید.',
      sender: 'ai',
      timestamp: new Date('2024-01-15T10:25:00')
    },
    {
      id: '2',
      content: 'قوانین مربوط به ساخت و ساز در مناطق مسکونی چگونه است؟',
      sender: 'user',
      timestamp: new Date('2024-01-15T10:30:00')
    },
    {
      id: '3',
      content: 'بر اساس اسناد بارگذاری شده، قوانین ساخت و ساز در مناطق مسکونی شامل محدودیت‌های زیر است:\n\n• حداکثر تراکم ساختمانی: 60 درصد\n• حداکثر تعداد طبقات: 4 طبقه\n• حداقل فاصله از همجوار: 3 متر\n• الزام رعایت ضوابط پارکینگ: 1 پارکینگ به ازای هر 100 متر مربع\n\nآیا سوال خاص‌تری دارید؟',
      sender: 'ai',
      timestamp: new Date('2024-01-15T10:31:00'),
      documents: ['قوانین شهرسازی.pdf', 'ضوابط ساخت و ساز.pdf']
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const goToDashboard = () => {
    navigate("/");
  };

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }


  const ask = async (query: string, k = 5) => {
    const { data } = await axios.post('https://behsazabackend.onrender.com/api/query', { question:query });
    return data; // { query, sources: [...] }
  };
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    try {
      const { question, answer } = await ask(newMessage);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `نتایج جستجو برای: ${question}`,
        sender: 'ai',
        timestamp: new Date(),
        search: {
          question,
          answer,
        },
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'خطا در دریافت نتایج جستجو. لطفاً مجدداً تلاش کنید.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }

    // Simulate AI response
    // setTimeout(() => {
    //   const aiMessage: Message = {
    //     id: (Date.now() + 1).toString(),
    //     content: 'در حال بررسی اسناد برای پاسخ به سوال شما... این یک پاسخ نمونه است.',
    //     sender: 'ai',
    //     timestamp: new Date()
    //   };
    //   setMessages(prev => [...prev, aiMessage]);
    //   setIsLoading(false);
    // }, 2000);
  };

  const createNewConversation = () => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: 'مکالمه جدید',
      lastMessage: '',
      timestamp: new Date(),
      messageCount: 0
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
    setMessages([{
      id: '1',
      content: 'سلام! من دستیار هوش مصنوعی شما هستم. می‌توانید در مورد اسناد بارگذاری شده سوال بپرسید.',
      sender: 'ai',
      timestamp: new Date()
    }]);
  };

  const activeConversation = conversations.find(c => c.id === activeConversationId);

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
                  چت با هوش مصنوعی
                </h1>
                <p className="text-sm text-muted-foreground persian-text">
                  {user.municipality} - {user.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={goToDashboard}>
                <Home className="w-4 h-4 ml-2" />
                <span className="persian-text">داشبورد</span>
              </Button>
              <Badge variant={user.role === "admin" ? "destructive" : user.role === "manager" ? "default" : "secondary"}>
                <User className="w-3 h-3 mr-1" />
                <span className="persian-text">{user.role}</span>
              </Badge>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 ml-2" />
                <span className="persian-text">خروج</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Conversations Sidebar */}
        <div className="w-80 border-l border-border bg-card/30 backdrop-blur-sm">
          <div className="p-4 border-b border-border">
            <Button onClick={createNewConversation} className="w-full persian-text">
              <Plus className="w-4 h-4 ml-2" />
              مکالمه جدید
            </Button>
          </div>

          <ScrollArea className="h-full">
            <div className="p-2 space-y-2">
              {conversations.map((conversation) => (
                <Card
                  key={conversation.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    activeConversationId === conversation.id
                      ? 'border-primary bg-primary/5'
                      : 'hover:bg-muted/30'
                  }`}
                  onClick={() => setActiveConversationId(conversation.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium persian-text text-sm truncate">
                          {conversation.title}
                        </h3>
                        <p className="text-xs text-muted-foreground persian-text line-clamp-2 mt-1">
                          {conversation.lastMessage}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span className="persian-text">
                              {conversation.timestamp.toLocaleDateString('fa-IR')}
                            </span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {conversation.messageCount}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-border bg-card/30 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold persian-text">
                  {activeConversation?.title}
                </h2>
                <p className="text-sm text-muted-foreground persian-text">
                  دستیار هوش مصنوعی آماده پاسخگویی
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4 max-w-4xl mx-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.sender === 'ai' && (
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="persian-text text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                    
                    {message.documents && (
                      <div className="mt-3 pt-3 border-t border-border/20">
                        <p className="text-xs text-muted-foreground persian-text mb-2">
                          منابع استفاده شده:
                        </p>
                        <div className="space-y-1">
                          {message.documents.map((doc, index) => (
                            <div key={index} className="flex items-center gap-2 text-xs">
                              <FileText className="w-3 h-3" />
                              <span className="persian-text">{doc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {message.search && (
                      <div className="mt-3 pt-3 border-t border-border/20">
                        <p className="text-xs text-muted-foreground persian-text mb-2">
                          پاسخ هوش مصنوعی:
                        </p>
                        <div className="space-y-3">
                          <div className="text-xs persian-text">
                            <span className="font-medium">پرسش:</span> {message.search.question}
                          </div>
                          <div className="text-sm persian-text whitespace-pre-wrap bg-background/40 p-3 rounded-md border border-border/40">
                            {message.search.answer}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-end mt-2">
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString('fa-IR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>

                  {message.sender === 'user' && (
                    <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-accent" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary animate-pulse" />
                  </div>
                  <div className="bg-muted rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border-t border-border bg-card/30 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-3">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="سوال خود را بنویسید..."
                  className="resize-none persian-text"
                  rows={3}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isLoading}
                  className="self-end"
                  size="icon"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground persian-text mt-2 text-center">
                از Enter برای ارسال و Shift+Enter برای خط جدید استفاده کنید
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;