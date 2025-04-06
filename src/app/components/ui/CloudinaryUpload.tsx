import React from "react";
import { CldUploadWidget } from "next-cloudinary";

// Simple type for the result returned by Cloudinary
interface CloudinaryResult {
  public_id: string;
  secure_url: string;
  original_filename: string;
}

interface CloudinaryUploadProps {
  onSuccess: (result: CloudinaryResult) => void;
  uploadPreset?: string;
  cloudName?: string;
  buttonText?: string;
  buttonClassName?: string;
  buttonStyle?: React.CSSProperties;
}

/**
 * A wrapper component for Cloudinary's upload widget that properly handles types
 */
const CloudinaryUpload: React.FC<CloudinaryUploadProps> = ({
  onSuccess,
  uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
    "recycle_uploads",
  cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  buttonText = "Choose Files to Upload",
  buttonClassName = "w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded transition-colors",
  buttonStyle,
}) => {
  // @ts-ignore - Ignoring TypeScript errors for the CldUploadWidget component
  return (
    <CldUploadWidget
      uploadPreset={uploadPreset}
      cloudName={cloudName}
      options={{
        sources: ["local", "url", "camera"],
        multiple: false,
        maxFiles: 1,
        styles: {
          palette: {
            window: "#1F2937",
            windowBorder: "#374151",
            tabIcon: "#10B981",
            menuIcons: "#D1D5DB",
            textDark: "#FFFFFF",
            textLight: "#9CA3AF",
            link: "#10B981",
            action: "#10B981",
            inactiveTabIcon: "#9CA3AF",
            error: "#EF4444",
            inProgress: "#10B981",
            complete: "#10B981",
            sourceBg: "#1F2937",
          },
        },
      }}
      onSuccess={(result: any) => {
        if (result.info && result.info.secure_url) {
          onSuccess({
            public_id: result.info.public_id,
            secure_url: result.info.secure_url,
            original_filename: result.info.original_filename || "unnamed",
          });
        }
      }}
    >
      {({ open }) => (
        <button
          onClick={() => open()}
          className={buttonClassName}
          style={buttonStyle}
        >
          {buttonText}
        </button>
      )}
    </CldUploadWidget>
  );
};

export default CloudinaryUpload;
