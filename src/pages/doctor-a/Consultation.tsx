import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Phone, Video, Paperclip } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { FileAttachment } from "@/components/chat/FileAttachment";

interface Message {
  id: string;
  sender: "self" | "other";
  content: string;
  timestamp: Date;
}

export default function Consultation() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "other",
      content: "Hello! I'm ready to help you with the consultation.",
      timestamp: new Date(Date.now() - 5 * 60000),
    },
  ]);
  const [activeTab, setActiveTab] = useState("text");
  const [isTyping, setIsTyping] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const specialist = {
    name: "Dr. Sarah Johnson",
    specialization: "Senior Cardiologist",
    status: "online",
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim() && attachedFiles.length === 0) return;

    const newMessage: Message = {
      id: String(messages.length + 1),
      sender: "self",
      content: message || "Sent files",
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setMessage("");
    setAttachedFiles([]);

    // Simulate specialist typing
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const replyMessage: Message = {
        id: String(messages.length + 2),
        sender: "other",
        content: "Thank you for sharing. Let me review this information.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, replyMessage]);
    }, 2000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachedFiles((prev) => [...prev, ...files]);
    toast({
      title: "Files attached",
      description: `${files.length} file(s) ready to send`,
    });
  };

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEndConsultation = () => {
    navigate(`/doctor-a/case-summary/${doctorId}`);
  };

  const handleVoiceCall = () => {
    navigate(`/call/audio/${doctorId}`);
  };

  const handleVideoCall = () => {
    navigate(`/call/video/${doctorId}`);
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
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 px-2">
                {messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    sender={msg.sender}
                    content={msg.content}
                    timestamp={msg.timestamp}
                    senderName={msg.sender === "other" ? specialist.name : undefined}
                    senderInitials="SJ"
                    isRead={msg.sender === "self"}
                  />
                ))}
                {isTyping && (
                  <TypingIndicator senderName={specialist.name} senderInitials="SJ" />
                )}
                <div ref={messagesEndRef} />
              </div>

              {attachedFiles.length > 0 && (
                <div className="mb-4 space-y-2">
                  {attachedFiles.map((file, index) => (
                    <FileAttachment
                      key={index}
                      fileName={file.name}
                      fileSize={`${(file.size / 1024).toFixed(1)} KB`}
                      fileType={
                        file.type.startsWith("image/")
                          ? "image"
                          : file.type.includes("pdf") || file.type.includes("document")
                          ? "document"
                          : "other"
                      }
                      onRemove={() => removeFile(index)}
                    />
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                  multiple
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                >
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
