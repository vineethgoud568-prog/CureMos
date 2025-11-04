import { Phone, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";

interface TopAppBarProps {
  title: string;
  showEmergencyContact?: boolean;
  onEmergencyClick?: () => void;
}

export const TopAppBar = ({
  title,
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
          
          <NotificationCenter />
        </div>
      </div>
    </header>
  );
};
