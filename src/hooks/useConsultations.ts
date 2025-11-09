import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface Consultation {
  id: string;
  status: string;
  consultation_type: string;
  urgency_level: string;
  start_time: string;
  end_time: string | null;
  created_at: string;
  doctor_a_id: string;
  doctor_b_id: string | null;
  patient_id: string | null;
  doctor_a_profile?: {
    full_name: string;
    specialization: string;
    hospital_affiliation: string;
    avatar_url: string | null;
  };
  doctor_b_profile?: {
    full_name: string;
    specialization: string;
    hospital_affiliation: string;
    avatar_url: string | null;
  };
  patient?: {
    full_name: string;
  };
}

export const useConsultations = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, userRole } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user || !userRole) {
      setLoading(false);
      return;
    }

    const fetchConsultations = async () => {
      try {
        let query = supabase
          .from("consultations")
          .select(`
            *,
            doctor_a_profile:profiles!consultations_doctor_a_id_fkey(
              full_name,
              specialization,
              hospital_affiliation,
              avatar_url
            ),
            doctor_b_profile:profiles!consultations_doctor_b_id_fkey(
              full_name,
              specialization,
              hospital_affiliation,
              avatar_url
            ),
            patient:patients(full_name)
          `)
          .order("created_at", { ascending: false });

        if (userRole === "doctor_a") {
          query = query.eq("doctor_a_id", user.id);
        } else if (userRole === "doctor_b") {
          query = query.eq("doctor_b_id", user.id);
        }

        const { data, error } = await query;

        if (error) throw error;
        setConsultations((data as any) || []);
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
      .channel("consultations_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "consultations",
          filter:
            userRole === "doctor_a"
              ? `doctor_a_id=eq.${user.id}`
              : `doctor_b_id=eq.${user.id}`,
        },
        () => {
          fetchConsultations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, userRole]);

  return { consultations, loading };
};
