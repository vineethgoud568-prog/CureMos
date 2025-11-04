import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  MessageSquare,
  Monitor,
  Settings,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function VideoCall() {
  const { callId } = useParams();
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleEndCall = () => {
    toast({
      title: "Call Ended",
      description: `Call duration: ${formatDuration(callDuration)}`,
    });
    navigate(-1);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    toast({
      title: isMuted ? "Microphone On" : "Microphone Off",
      description: isMuted ? "You are now unmuted" : "You are now muted",
    });
  };

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    toast({
      title: isVideoOff ? "Camera On" : "Camera Off",
      description: isVideoOff ? "Your camera is now on" : "Your camera is now off",
    });
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    toast({
      title: isScreenSharing ? "Screen Sharing Stopped" : "Screen Sharing Started",
      description: isScreenSharing
        ? "You stopped sharing your screen"
        : "You are now sharing your screen",
    });
  };

  return (
    <div className="fixed inset-0 bg-background flex flex-col">
      {/* Remote Video Feed */}
      <div className="flex-1 relative bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 rounded-full bg-primary/20 mx-auto mb-4 flex items-center justify-center">
            <span className="text-4xl font-semibold text-primary">DR</span>
          </div>
          <h3 className="text-xl font-semibold mb-1">Dr. Sarah Johnson</h3>
          <Badge variant="secondary">Connected</Badge>
        </div>

        {/* Call Quality Indicator */}
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
            HD Quality
          </Badge>
        </div>

        {/* Call Duration */}
        <div className="absolute top-4 right-4">
          <Badge variant="secondary">{formatDuration(callDuration)}</Badge>
        </div>

        {/* Local Video Preview */}
        <Card className="absolute bottom-4 right-4 w-40 h-32 overflow-hidden border-2 border-primary">
          <div className="w-full h-full bg-gradient-to-br from-secondary/50 to-secondary/20 flex items-center justify-center">
            {isVideoOff ? (
              <VideoOff className="w-8 h-8 text-muted-foreground" />
            ) : (
              <span className="text-2xl font-semibold text-foreground">You</span>
            )}
          </div>
        </Card>
      </div>

      {/* Controls */}
      <div className="p-6 bg-card border-t border-border">
        <div className="flex justify-center items-center gap-4 max-w-2xl mx-auto">
          <Button
            variant={isMuted ? "destructive" : "secondary"}
            size="lg"
            onClick={toggleMute}
            className="h-14 w-14 rounded-full"
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </Button>

          <Button
            variant={isVideoOff ? "destructive" : "secondary"}
            size="lg"
            onClick={toggleVideo}
            className="h-14 w-14 rounded-full"
          >
            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </Button>

          <Button
            variant={isScreenSharing ? "default" : "secondary"}
            size="lg"
            onClick={toggleScreenShare}
            className="h-14 w-14 rounded-full"
          >
            <Monitor className="w-5 h-5" />
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={() => setShowChat(!showChat)}
            className="h-14 w-14 rounded-full"
          >
            <MessageSquare className="w-5 h-5" />
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="h-14 w-14 rounded-full"
          >
            <Settings className="w-5 h-5" />
          </Button>

          <div className="w-4" />

          <Button
            variant="destructive"
            size="lg"
            onClick={handleEndCall}
            className="h-14 w-14 rounded-full"
          >
            <PhoneOff className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
