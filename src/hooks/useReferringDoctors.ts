import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface ReferringDoctor {
  id: string;
  full_name: string;
  specialization: string;
  hospital_affiliation: string;
  avatar_url: string | null;
  consultationCount: number;
  lastConsultation: string | null;
}

export const useReferringDoctors = () => {
  const [doctors, setDoctors] = useState<ReferringDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchReferringDoctors = async () => {
      try {
        // Get consultations where current user is doctor_b
        const { data: consultations, error: consultError } = await supabase
          .from("consultations")
          .select(`
            doctor_a_id,
            start_time,
            doctor_a_profile:profiles!consultations_doctor_a_id_fkey(
              id,
              full_name,
              specialization,
              hospital_affiliation,
              avatar_url
            )
          `)
          .eq("doctor_b_id", user.id)
          .not("doctor_a_id", "is", null);

        if (consultError) throw consultError;

        // Group by doctor and count consultations
        const doctorMap = new Map<string, ReferringDoctor>();

        consultations?.forEach((consultation: any) => {
          const profile = consultation.doctor_a_profile;
          if (!profile) return;

          const existing = doctorMap.get(profile.id);
          if (existing) {
            existing.consultationCount++;
            if (
              !existing.lastConsultation ||
              new Date(consultation.start_time) > new Date(existing.lastConsultation)
            ) {
              existing.lastConsultation = consultation.start_time;
            }
          } else {
            doctorMap.set(profile.id, {
              id: profile.id,
              full_name: profile.full_name || "Unknown Doctor",
              specialization: profile.specialization || "General Practice",
              hospital_affiliation: profile.hospital_affiliation || "Not specified",
              avatar_url: profile.avatar_url,
              consultationCount: 1,
              lastConsultation: consultation.start_time,
            });
          }
        });

        setDoctors(Array.from(doctorMap.values()));
      } catch (error: any) {
        console.error("Error fetching referring doctors:", error);
        toast({
          title: "Error loading doctors",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReferringDoctors();
  }, [user]);

  return { doctors, loading };
};
