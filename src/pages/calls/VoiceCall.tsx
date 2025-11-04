import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Mic,
  MicOff,
  PhoneOff,
  Volume2,
  VolumeX,
  UserPlus,
  Grid3x3,
  FileText,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function VoiceCall() {
  const { callId } = useParams();
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [callNotes, setCallNotes] = useState("");

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

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
    toast({
      title: isSpeakerOn ? "Speaker Off" : "Speaker On",
      description: isSpeakerOn ? "Switched to earpiece" : "Switched to speaker",
    });
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Call Info */}
        <div className="text-center space-y-6">
          <div className="w-32 h-32 rounded-full bg-primary/20 mx-auto flex items-center justify-center ring-4 ring-primary/10">
            <span className="text-5xl font-semibold text-primary">DR</span>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-2">Dr. Sarah Johnson</h2>
            <p className="text-muted-foreground mb-3">Cardiologist</p>
            <Badge variant="secondary" className="text-base px-4 py-1">
              {formatDuration(callDuration)}
            </Badge>
          </div>

          {/* Call Quality */}
          <div className="flex items-center justify-center gap-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((bar) => (
                <div
                  key={bar}
                  className={`w-1 bg-accent rounded-full ${
                    bar === 1 ? "h-2" : bar === 2 ? "h-3" : bar === 3 ? "h-4" : "h-5"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">Excellent</span>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <div className="flex justify-center gap-4">
            <Button
              variant={isMuted ? "destructive" : "secondary"}
              size="lg"
              onClick={toggleMute}
              className="h-16 w-16 rounded-full"
            >
              {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </Button>

            <Button
              variant="destructive"
              size="lg"
              onClick={handleEndCall}
              className="h-20 w-20 rounded-full"
            >
              <PhoneOff className="w-7 h-7" />
            </Button>

            <Button
              variant={isSpeakerOn ? "default" : "secondary"}
              size="lg"
              onClick={toggleSpeaker}
              className="h-16 w-16 rounded-full"
            >
              {isSpeakerOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
            </Button>
          </div>

          <div className="flex justify-center gap-3">
            <Button variant="outline" size="sm">
              <Grid3x3 className="w-4 h-4 mr-2" />
              Keypad
            </Button>

            <Button variant="outline" size="sm">
              <UserPlus className="w-4 h-4 mr-2" />
              Add
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Notes
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Call Notes</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <Textarea
                    placeholder="Add notes during the call..."
                    value={callNotes}
                    onChange={(e) => setCallNotes(e.target.value)}
                    rows={15}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
}
