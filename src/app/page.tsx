import Hero from "@/app/components/home/Hero";
import Mission from "@/app/components/home/Mission";
import Features from "@/app/components/home/Features";
import MediaSlider from "@/app/components/MediaSlider";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <Hero />
      <Mission />
      <Features />
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Media Gallery</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-center mb-8">
          Explore our visual content showcasing our facilities, processes, and environmental impact.
        </p>
        <MediaSlider />
      </div>
    </div>
  );
}
