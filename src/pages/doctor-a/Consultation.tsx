import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Phone, Video, Paperclip, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Consultation() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "1",
      sender: "specialist",
      content: "Hello! I'm ready to help you with the consultation.",
      timestamp: new Date(Date.now() - 5 * 60000),
    },
  ]);
  const [activeTab, setActiveTab] = useState("text");

  const specialist = {
    name: "Dr. Sarah Johnson",
    specialization: "Senior Cardiologist",
    status: "online",
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: String(messages.length + 1),
      sender: "self",
      content: message,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setMessage("");
  };

  const handleEndConsultation = () => {
    navigate(`/doctor-a/case-summary/${doctorId}`);
  };

  const handleVoiceCall = () => {
    toast({
      title: "Voice Call",
      description: "Voice calling will be implemented in Phase 4",
    });
  };

  const handleVideoCall = () => {
    toast({
      title: "Video Call",
      description: "Video calling will be implemented in Phase 4",
    });
  };

  return (
    <MainLayout title="Consultation" userType="doctor-a" showEmergencyContact={false}>
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <Card className="flex-shrink-0 m-4 mb-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-primary/10 text-primary">SJ</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{specialist.name}</h3>
                  <p className="text-sm text-muted-foreground">{specialist.specialization}</p>
                </div>
              </div>
              <Badge className="bg-accent text-accent-foreground">Online</Badge>
            </div>
          </CardHeader>
        </Card>

        <div className="flex-1 overflow-hidden px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="text">Text</TabsTrigger>
              <TabsTrigger value="voice" onClick={() => handleVoiceCall()}>Voice</TabsTrigger>
              <TabsTrigger value="video" onClick={() => handleVideoCall()}>Video</TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="flex-1 flex flex-col mt-4 overflow-hidden">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "self" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.sender === "self"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.sender === "self" ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}
                      >
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Input
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button onClick={handleSendMessage} size="icon">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="p-4 border-t">
          <Button
            variant="destructive"
            onClick={handleEndConsultation}
            className="w-full"
          >
            End Consultation
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
