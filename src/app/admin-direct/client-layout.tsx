"use client";

import { useEffect } from "react";

export default function ClientAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Add a class to the body to prevent the main layout's footer from appearing
    document.body.classList.add("admin-page");

    // Clean up on unmount
    return () => {
      document.body.classList.remove("admin-page");
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col isolate bg-gray-100 dark:bg-gray-900">
      {children}
    </div>
  );
}
