import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center p-8">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-medium mb-6">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        The page you are looking for might have been removed or is temporarily unavailable.
      </p>
      <Link 
        href="/" 
        className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-all"
      >
        Return to Homepage
      </Link>
    </div>
  );
} 