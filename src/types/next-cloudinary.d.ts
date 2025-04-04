declare module "next-cloudinary" {
  import { ReactNode } from "react";

  export interface CldUploadWidgetPropsOptions {
    sources?: string[];
    multiple?: boolean;
    maxFiles?: number;
    cloudName?: string;
    styles?: Record<string, any>;
    [key: string]: any;
  }

  export interface CldUploadWidgetPropsChildren {
    open: () => void;
  }

  export interface CldUploadWidgetProps {
    uploadPreset: string;
    cloudName?: string;
    options?: CldUploadWidgetPropsOptions;
    onSuccess?: (result: any) => void;
    children: (props: CldUploadWidgetPropsChildren) => ReactNode;
    [key: string]: any;
  }

  export function CldUploadWidget(props: CldUploadWidgetProps): JSX.Element;
}
