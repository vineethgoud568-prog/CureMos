import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface Patient {
  id: string;
  full_name: string;
  date_of_birth: string | null;
  gender: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  medical_history: string | null;
  current_medications: string | null;
  allergies: string | null;
  blood_type: string | null;
  created_at: string;
  updated_at: string;
  doctor_a_id: string;
  referral?: {
    id: string;
    status: string;
    referral_date: string;
    admission_date: string | null;
    diagnosis: string | null;
    doctor_b_profile?: {
      full_name: string;
      specialization: string;
    };
  };
}

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, userRole } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user || !userRole) {
      setLoading(false);
      return;
    }

    const fetchPatients = async () => {
      try {
        if (userRole === "doctor_a") {
          const { data, error } = await supabase
            .from("patients")
            .select(`
              *,
              referral:referrals(
                id,
                status,
                referral_date,
                admission_date,
                diagnosis,
                doctor_b_profile:profiles!referrals_doctor_b_id_fkey(
                  full_name,
                  specialization
                )
              )
            `)
            .eq("doctor_a_id", user.id)
            .order("created_at", { ascending: false });

          if (error) throw error;
          setPatients((data as any) || []);
        } else if (userRole === "doctor_b") {
          // Doctor B sees patients through referrals
          const { data, error } = await supabase
            .from("referrals")
            .select(`
              patient:patients(
                *,
                referral:referrals(
                  id,
                  status,
                  referral_date,
                  admission_date,
                  diagnosis,
                  doctor_b_profile:profiles!referrals_doctor_b_id_fkey(
                    full_name,
                    specialization
                  )
                )
              )
            `)
            .eq("doctor_b_id", user.id)
            .order("referral_date", { ascending: false });

          if (error) throw error;
          const patientsData = data?.map((item: any) => item.patient).filter(Boolean) || [];
          setPatients(patientsData);
        }
      } catch (error: any) {
        console.error("Error fetching patients:", error);
        toast({
          title: "Error loading patients",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();

    // Subscribe to real-time updates
    const channel = supabase
      .channel("patients_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "patients",
          filter: userRole === "doctor_a" ? `doctor_a_id=eq.${user.id}` : undefined,
        },
        () => {
          fetchPatients();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, userRole]);

  const addPatient = async (patientData: {
    full_name: string;
    date_of_birth?: string;
    gender?: string;
    phone?: string;
    email?: string;
    address?: string;
    medical_history?: string;
    current_medications?: string;
    allergies?: string;
    blood_type?: string;
  }) => {
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("patients")
      .insert([
        {
          ...patientData,
          doctor_a_id: user.id,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  return { patients, loading, addPatient };
};
