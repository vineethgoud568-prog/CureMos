import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Paperclip, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  uploadFile,
  validateFileSize,
  validateFileType,
  ALLOWED_DOCUMENT_TYPES,
} from "@/utils/fileUpload";
import { useAuth } from "@/contexts/AuthContext";

interface FileUploadProps {
  onFileUploaded: (url: string, fileName: string) => void;
  maxSizeMB?: number;
}

export const FileUpload = ({ onFileUploaded, maxSizeMB = 10 }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!validateFileType(file, ALLOWED_DOCUMENT_TYPES)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or image file",
        variant: "destructive",
      });
      return;
    }

    if (!validateFileSize(file, maxSizeMB)) {
      toast({
        title: "File too large",
        description: `Maximum file size is ${maxSizeMB}MB`,
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;

    setUploading(true);
    try {
      const result = await uploadFile(selectedFile, "medical_documents", user.id);

      if (result) {
        onFileUploaded(result.url, selectedFile.name);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        toast({
          title: "File uploaded",
          description: "Your file has been uploaded successfully",
        });
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_DOCUMENT_TYPES.join(",")}
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      {!selectedFile ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <Paperclip className="h-5 w-5" />
        </Button>
      ) : (
        <div className="flex items-center gap-2 bg-muted px-3 py-2 rounded-md">
          <span className="text-sm truncate max-w-[200px]">
            {selectedFile.name}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={clearSelection}
            disabled={uploading}
          >
            <X className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
