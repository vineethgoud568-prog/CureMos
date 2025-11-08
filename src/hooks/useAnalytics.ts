import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ConsultationAnalytics {
  totalConsultations: number;
  completedConsultations: number;
  activeConsultations: number;
  avgConsultationDuration: number;
  consultationsByType: Record<string, number>;
  consultationsByDay: Array<{ date: string; count: number }>;
}

export interface DoctorPerformanceMetrics {
  totalConsultations: number;
  averageRating: number;
  responseTime: number;
  successfulReferrals: number;
}

export const useAnalytics = (userId: string, userType: "doctor_a" | "doctor_b") => {
  const [analytics, setAnalytics] = useState<ConsultationAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Build query based on user type
        const column = userType === "doctor_a" ? "doctor_a_id" : "doctor_b_id";
        const { data: consultations, error: consultationsError } = await supabase
          .from("consultations")
          .select("*")
          .eq(column, userId)
          .gte("created_at", thirtyDaysAgo.toISOString());

        if (consultationsError) throw consultationsError;

        // Calculate analytics
        const total = consultations?.length || 0;
        const completed = consultations?.filter((c) => c.status === "completed").length || 0;
        const active = consultations?.filter((c) => c.status === "active").length || 0;

        // Calculate average duration
        const completedWithDuration = consultations?.filter(
          (c) => c.status === "completed" && c.start_time && c.end_time
        );
        const avgDuration =
          completedWithDuration && completedWithDuration.length > 0
            ? completedWithDuration.reduce((sum, c) => {
                const duration =
                  new Date(c.end_time!).getTime() - new Date(c.start_time).getTime();
                return sum + duration;
              }, 0) / completedWithDuration.length
            : 0;

        // Group by type
        const byType: Record<string, number> = {};
        consultations?.forEach((c) => {
          byType[c.consultation_type] = (byType[c.consultation_type] || 0) + 1;
        });

        // Group by day
        const byDay: Record<string, number> = {};
        consultations?.forEach((c) => {
          const date = new Date(c.created_at).toISOString().split("T")[0];
          byDay[date] = (byDay[date] || 0) + 1;
        });

        const consultationsByDay = Object.entries(byDay)
          .map(([date, count]) => ({ date, count }))
          .sort((a, b) => a.date.localeCompare(b.date));

        setAnalytics({
          totalConsultations: total,
          completedConsultations: completed,
          activeConsultations: active,
          avgConsultationDuration: avgDuration,
          consultationsByType: byType,
          consultationsByDay,
        });
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchAnalytics();
    }
  }, [userId, userType]);

  return { analytics, loading, error };
};

export const useDoctorPerformance = (doctorId: string) => {
  const [metrics, setMetrics] = useState<DoctorPerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);

        const { data: consultations } = await supabase
          .from("consultations")
          .select("*")
          .eq("doctor_b_id", doctorId);

        const { data: referrals } = await supabase
          .from("referrals")
          .select("*")
          .eq("doctor_b_id", doctorId)
          .eq("status", "admitted");

        setMetrics({
          totalConsultations: consultations?.length || 0,
          averageRating: 0, // Will be implemented with rating system
          responseTime: 0, // Calculate from consultation data
          successfulReferrals: referrals?.length || 0,
        });
      } catch (err) {
        console.error("Error fetching doctor performance:", err);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      fetchMetrics();
    }
  }, [doctorId]);

  return { metrics, loading };
};
