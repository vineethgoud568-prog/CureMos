import { X, File, Image as ImageIcon, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FileAttachmentProps {
  fileName: string;
  fileSize: string;
  fileType: "image" | "document" | "other";
  onRemove?: () => void;
  preview?: string;
}

export const FileAttachment = ({
  fileName,
  fileSize,
  fileType,
  onRemove,
  preview,
}: FileAttachmentProps) => {
  const getIcon = () => {
    switch (fileType) {
      case "image":
        return <ImageIcon className="w-4 h-4" />;
      case "document":
        return <FileText className="w-4 h-4" />;
      default:
        return <File className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-muted rounded-lg border border-border">
      {preview && fileType === "image" ? (
        <img src={preview} alt={fileName} className="w-12 h-12 object-cover rounded" />
      ) : (
        <div className="w-12 h-12 bg-primary/10 rounded flex items-center justify-center">
          {getIcon()}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{fileName}</p>
        <p className="text-xs text-muted-foreground">{fileSize}</p>
      </div>
      {onRemove && (
        <Button variant="ghost" size="icon" onClick={onRemove} className="h-8 w-8">
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};
