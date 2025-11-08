import { WifiOff, Wifi } from "lucide-react";
import { useOfflineSync } from "@/hooks/useOfflineSync";
import { cn } from "@/lib/utils";

export const OfflineIndicator = () => {
  const { isConnected, isSyncing } = useOfflineSync();

  if (isConnected && !isSyncing) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full shadow-lg transition-all",
        isConnected ? "bg-success text-success-foreground" : "bg-warning text-warning-foreground"
      )}
    >
      <div className="flex items-center gap-2">
        {isConnected ? (
          <>
            <Wifi className="w-4 h-4" />
            <span className="text-sm font-medium">Syncing...</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4" />
            <span className="text-sm font-medium">Offline Mode</span>
          </>
        )}
      </div>
    </div>
  );
};
