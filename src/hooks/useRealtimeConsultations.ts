import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

type Consultation = Tables<"consultations">;

export const useRealtimeConsultations = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, userRole } = useAuth();

  useEffect(() => {
    if (!user || !userRole) {
      setLoading(false);
      return;
    }

    const fetchConsultations = async () => {
      try {
        const column = userRole === "doctor_a" ? "doctor_a_id" : "doctor_b_id";
        const { data, error } = await supabase
          .from("consultations")
          .select("*")
          .eq(column, user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setConsultations(data || []);
      } catch (error: any) {
        console.error("Error fetching consultations:", error);
        toast({
          title: "Error loading consultations",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();

    // Subscribe to real-time updates
    const channel = supabase
      .channel("consultations-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "consultations",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newConsultation = payload.new as Consultation;
            const isRelevant =
              (userRole === "doctor_a" && newConsultation.doctor_a_id === user.id) ||
              (userRole === "doctor_b" && newConsultation.doctor_b_id === user.id);

            if (isRelevant) {
              setConsultations((prev) => [newConsultation, ...prev]);
            }
          } else if (payload.eventType === "UPDATE") {
            setConsultations((prev) =>
              prev.map((consultation) =>
                consultation.id === payload.new.id
                  ? (payload.new as Consultation)
                  : consultation
              )
            );
          } else if (payload.eventType === "DELETE") {
            setConsultations((prev) =>
              prev.filter((consultation) => consultation.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, userRole, toast]);

  return { consultations, loading };
};
