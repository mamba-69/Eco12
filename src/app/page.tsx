import Hero from "@/app/components/home/Hero";
import Mission from "@/app/components/home/Mission";
import MediaSlider from "@/app/components/home/MediaSlider";
import Features from "@/app/components/home/Features";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <Hero />
      <Mission />
      <Features />
      <MediaSlider />
    </main>
  );
}
