import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";

type Message = Tables<"messages">;
type MessageInsert = TablesInsert<"messages">;

export const useRealtimeMessages = (consultationId: string | undefined) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!consultationId) {
      setLoading(false);
      return;
    }

    // Fetch initial messages
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .eq("consultation_id", consultationId)
          .order("created_at", { ascending: true });

        if (error) throw error;
        setMessages(data || []);
      } catch (error: any) {
        console.error("Error fetching messages:", error);
        toast({
          title: "Error loading messages",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`messages:${consultationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `consultation_id=eq.${consultationId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `consultation_id=eq.${consultationId}`,
        },
        (payload) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === payload.new.id ? (payload.new as Message) : msg
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [consultationId, toast]);

  const sendMessage = async (messageData: Omit<MessageInsert, "consultation_id">) => {
    if (!consultationId) {
      toast({
        title: "Error",
        description: "No consultation active",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("messages").insert({
        ...messageData,
        consultation_id: consultationId,
      });

      if (error) throw error;
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from("messages")
        .update({ read_status: true })
        .eq("id", messageId);

      if (error) throw error;
    } catch (error: any) {
      console.error("Error marking message as read:", error);
    }
  };

  return { messages, loading, sendMessage, markAsRead };
};
