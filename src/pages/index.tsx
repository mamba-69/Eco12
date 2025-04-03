import { useEffect } from "react";
import { useRouter } from "next/router";

export default function LegacyHomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the App Router homepage
    router.replace("/");
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Eco-Expert Recycling</h1>
      <p className="mt-4 text-xl">Loading your eco-friendly experience...</p>
    </div>
  );
}
