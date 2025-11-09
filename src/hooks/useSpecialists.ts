import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Specialist {
  id: string;
  full_name: string;
  specialization: string;
  hospital_affiliation: string;
  location_lat: number | null;
  location_lng: number | null;
  avatar_url: string | null;
  phone: string | null;
  medical_license: string | null;
}

export const useSpecialists = (specialization?: string) => {
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSpecialists = async () => {
      try {
        // Get all doctor_b users
        const { data: doctorBRoles, error: rolesError } = await supabase
          .from("user_roles")
          .select("user_id")
          .eq("role", "doctor_b");

        if (rolesError) throw rolesError;

        const doctorBIds = doctorBRoles?.map((r) => r.user_id) || [];

        if (doctorBIds.length === 0) {
          setSpecialists([]);
          setLoading(false);
          return;
        }

        let query = supabase
          .from("profiles")
          .select("*")
          .in("id", doctorBIds);

        if (specialization) {
          query = query.ilike("specialization", `%${specialization}%`);
        }

        const { data, error } = await query;

        if (error) throw error;
        setSpecialists((data as any) || []);
      } catch (error: any) {
        console.error("Error fetching specialists:", error);
        toast({
          title: "Error loading specialists",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialists();
  }, [specialization]);

  return { specialists, loading };
};
