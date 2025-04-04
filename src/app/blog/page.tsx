import BlogPosts from "@/app/components/BlogPosts";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Blog</h1>
        <p className="text-xl text-muted-foreground">
          News, insights, and best practices in e-waste management and sustainability
        </p>
      </div>
      
      <BlogPosts />
    </div>
  );
} 