import React, { useRef, useState } from "react";
import { storage, BUCKETS } from "@/app/lib/appwrite";
import { ID } from "appwrite";

// Simple type for the result returned by the upload
interface FileUploadResult {
  fileId: string;
  url: string;
  name: string;
}

interface AppwriteUploadProps {
  onSuccess: (result: FileUploadResult) => void;
  buttonText?: string;
  buttonClassName?: string;
  buttonStyle?: React.CSSProperties;
  accept?: string;
}

/**
 * A file upload component that uses Appwrite storage
 */
const AppwriteUpload: React.FC<AppwriteUploadProps> = ({
  onSuccess,
  buttonText = "Choose Files to Upload",
  buttonClassName = "w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded transition-colors",
  buttonStyle,
  accept = "image/*,video/*",
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      const file = files[0];

      // Upload the file to Appwrite Storage
      const uploadedFile = await storage.createFile(
        BUCKETS.MEDIA,
        ID.unique(),
        file
      );

      // Get the file URL
      const fileUrl = storage.getFileView(BUCKETS.MEDIA, uploadedFile.$id);

      // Call the onSuccess callback with the result
      onSuccess({
        fileId: uploadedFile.$id,
        url: fileUrl.toString(),
        name: file.name,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        className="hidden"
        accept={accept}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className={buttonClassName}
        style={buttonStyle}
        disabled={isUploading}
      >
        {isUploading ? "Uploading..." : buttonText}
      </button>
    </div>
  );
};

export default AppwriteUpload;
