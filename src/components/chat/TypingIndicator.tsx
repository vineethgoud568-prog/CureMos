import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TypingIndicatorProps {
  senderName: string;
  senderInitials?: string;
}

export const TypingIndicator = ({ senderName, senderInitials = "DR" }: TypingIndicatorProps) => {
  return (
    <div className="flex gap-3 items-end">
      <Avatar className="w-8 h-8">
        <AvatarFallback className="bg-primary/10 text-primary text-xs">
          {senderInitials}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col items-start">
        <span className="text-xs text-muted-foreground mb-1">{senderName}</span>
        <div className="bg-muted rounded-lg p-3 flex gap-1">
          <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
};
