import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCheck } from "lucide-react";

interface ChatMessageProps {
  sender: "self" | "other";
  content: string;
  timestamp: Date;
  senderName?: string;
  senderInitials?: string;
  isRead?: boolean;
}

export const ChatMessage = ({
  sender,
  content,
  timestamp,
  senderName,
  senderInitials = "DR",
  isRead = false,
}: ChatMessageProps) => {
  const isSelf = sender === "self";

  return (
    <div className={`flex gap-3 ${isSelf ? "flex-row-reverse" : "flex-row"}`}>
      {!isSelf && (
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-primary/10 text-primary text-xs">
            {senderInitials}
          </AvatarFallback>
        </Avatar>
      )}
      <div className={`flex flex-col ${isSelf ? "items-end" : "items-start"} max-w-[75%]`}>
        {!isSelf && senderName && (
          <span className="text-xs text-muted-foreground mb-1">{senderName}</span>
        )}
        <div
          className={`rounded-lg p-3 ${
            isSelf
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground"
          }`}
        >
          <p className="text-sm whitespace-pre-wrap break-words">{content}</p>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <span
            className={`text-xs ${
              isSelf ? "text-muted-foreground" : "text-muted-foreground"
            }`}
          >
            {timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {isSelf && (
            <CheckCheck className={`w-3 h-3 ${isRead ? "text-accent" : "text-muted-foreground"}`} />
          )}
        </div>
      </div>
    </div>
  );
};
