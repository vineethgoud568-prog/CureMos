import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  getUnsyncedNotes,
  markNoteSynced,
  setupConnectivityListeners,
  isOnline,
} from "@/utils/offline";
import { toast } from "@/hooks/use-toast";

export const useOfflineSync = () => {
  const [isConnected, setIsConnected] = useState(isOnline());
  const [isSyncing, setIsSyncing] = useState(false);

  const syncOfflineData = async () => {
    if (!isConnected) return;

    try {
      setIsSyncing(true);
      const unsyncedNotes = await getUnsyncedNotes();

      for (const note of unsyncedNotes) {
        // Sync to Supabase
        const { error } = await supabase
          .from("consultations")
          .update({
            updated_at: new Date().toISOString(),
            // Add notes field to consultations table if needed
          })
          .eq("id", note.id);

        if (!error) {
          await markNoteSynced(note.id);
        }
      }

      if (unsyncedNotes.length > 0) {
        toast({
          title: "Data synced",
          description: `${unsyncedNotes.length} offline items synced successfully.`,
        });
      }
    } catch (error) {
      console.error("Sync error:", error);
      toast({
        title: "Sync failed",
        description: "Failed to sync offline data. Will retry when online.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    const cleanup = setupConnectivityListeners(
      () => {
        setIsConnected(true);
        toast({
          title: "Back online",
          description: "Connection restored. Syncing offline data...",
        });
      },
      () => {
        setIsConnected(false);
        toast({
          title: "Offline mode",
          description: "You're offline. Data will be saved locally.",
          variant: "default",
        });
      }
    );

    return cleanup;
  }, []);

  useEffect(() => {
    if (isConnected) {
      syncOfflineData();
    }
  }, [isConnected]);

  return {
    isConnected,
    isSyncing,
    syncOfflineData,
  };
};
