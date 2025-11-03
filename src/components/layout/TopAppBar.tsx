import { Bell, Phone, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

interface TopAppBarProps {
  title: string;
  notificationCount?: number;
  showEmergencyContact?: boolean;
  onEmergencyClick?: () => void;
}

export const TopAppBar = ({
  title,
  notificationCount = 0,
  showEmergencyContact = true,
  onEmergencyClick,
}: TopAppBarProps) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-card border-b border-border">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <Button variant="ghost" className="w-full justify-start">
                  Settings
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Help & Support
                </Button>
                <Button variant="ghost" className="w-full justify-start text-destructive">
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>

        <div className="flex items-center gap-2">
          {showEmergencyContact && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onEmergencyClick}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Phone className="w-5 h-5" />
            </Button>
          )}
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {notificationCount > 9 ? "9+" : notificationCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};
