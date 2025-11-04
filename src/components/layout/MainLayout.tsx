import { ReactNode } from "react";
import { TopAppBar } from "./TopAppBar";
import { BottomNav } from "./BottomNav";

interface MainLayoutProps {
  children: ReactNode;
  title: string;
  userType: "doctor-a" | "doctor-b";
  showEmergencyContact?: boolean;
  onEmergencyClick?: () => void;
}

export const MainLayout = ({
  children,
  title,
  userType,
  showEmergencyContact,
  onEmergencyClick,
}: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopAppBar
        title={title}
        showEmergencyContact={showEmergencyContact}
        onEmergencyClick={onEmergencyClick}
      />
      
      <main className="flex-1 pb-20 overflow-y-auto">
        {children}
      </main>

      <BottomNav userType={userType} />
    </div>
  );
};
