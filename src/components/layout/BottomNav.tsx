import { Link, useLocation } from "react-router-dom";
import { Home, Users, History, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

interface BottomNavProps {
  userType: "doctor-a" | "doctor-b";
}

const doctorANav: NavItem[] = [
  { icon: Home, label: "Home", path: "/doctor-a/home" },
  { icon: Users, label: "Patients", path: "/doctor-a/patients" },
  { icon: History, label: "History", path: "/doctor-a/history" },
  { icon: User, label: "Profile", path: "/doctor-a/profile" },
];

const doctorBNav: NavItem[] = [
  { icon: Home, label: "Home", path: "/doctor-b/home" },
  { icon: Users, label: "Patients", path: "/doctor-b/patients" },
  { icon: Users, label: "Doctors", path: "/doctor-b/doctors" },
  { icon: User, label: "Profile", path: "/doctor-b/profile" },
];

export const BottomNav = ({ userType }: BottomNavProps) => {
  const location = useLocation();
  const navItems = userType === "doctor-a" ? doctorANav : doctorBNav;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
