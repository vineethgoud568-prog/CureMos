import { useEffect, useRef, useState } from "react";
import { WebRTCConnection } from "@/utils/webrtc";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useWebRTC = (consultationId: string, isVideoEnabled: boolean = true) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(isVideoEnabled);
  const webrtcRef = useRef<WebRTCConnection | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const initWebRTC = async () => {
      try {
        webrtcRef.current = new WebRTCConnection();

        // Set up callbacks
        webrtcRef.current.onRemoteStream((stream) => {
          setRemoteStream(stream);
        });

        webrtcRef.current.onIceCandidate(async (candidate) => {
          // Send ICE candidate through Supabase real-time
          const channel = supabase.channel(`webrtc:${consultationId}`);
          await channel.send({
            type: "broadcast",
            event: "ice-candidate",
            payload: { candidate },
          });
        });

        // Start local stream
        const stream = await webrtcRef.current.startLocalStream(isVideoEnabled);
        setLocalStream(stream);

        // Subscribe to signaling messages
        const channel = supabase
          .channel(`webrtc:${consultationId}`)
          .on("broadcast", { event: "offer" }, async ({ payload }) => {
            if (webrtcRef.current) {
              await webrtcRef.current.setRemoteDescription(payload.offer);
              const answer = await webrtcRef.current.createAnswer();
              await channel.send({
                type: "broadcast",
                event: "answer",
                payload: { answer },
              });
            }
          })
          .on("broadcast", { event: "answer" }, async ({ payload }) => {
            if (webrtcRef.current) {
              await webrtcRef.current.setRemoteDescription(payload.answer);
            }
          })
          .on("broadcast", { event: "ice-candidate" }, async ({ payload }) => {
            if (webrtcRef.current && payload.candidate) {
              await webrtcRef.current.addIceCandidate(payload.candidate);
            }
          })
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      } catch (error) {
        console.error("Error initializing WebRTC:", error);
        toast({
          title: "Failed to initialize call",
          description: "Please check your camera and microphone permissions",
          variant: "destructive",
        });
      }
    };

    initWebRTC();

    return () => {
      webrtcRef.current?.close();
    };
  }, [consultationId, isVideoEnabled, toast]);

  const createOffer = async () => {
    if (!webrtcRef.current) return;

    try {
      const offer = await webrtcRef.current.createOffer();
      const channel = supabase.channel(`webrtc:${consultationId}`);
      await channel.send({
        type: "broadcast",
        event: "offer",
        payload: { offer },
      });
    } catch (error) {
      console.error("Error creating offer:", error);
      toast({
        title: "Failed to initiate call",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const toggleAudio = () => {
    if (webrtcRef.current) {
      const newState = !isAudioEnabled;
      webrtcRef.current.toggleAudio(newState);
      setIsAudioEnabled(newState);
    }
  };

  const toggleVideo = () => {
    if (webrtcRef.current) {
      const newState = !isVideoOn;
      webrtcRef.current.toggleVideo(newState);
      setIsVideoOn(newState);
    }
  };

  const endCall = () => {
    webrtcRef.current?.close();
    setLocalStream(null);
    setRemoteStream(null);
  };

  return {
    localStream,
    remoteStream,
    isAudioEnabled,
    isVideoOn,
    createOffer,
    toggleAudio,
    toggleVideo,
    endCall,
  };
};
