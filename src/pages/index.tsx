import Link from "next/link";

export default function LegacyHomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <h1 className="text-4xl md:text-5xl font-bold text-center">
        Eco-Expert Recycling
      </h1>
      <p className="mt-4 text-xl text-center">
        Sustainable e-waste solutions for a greener tomorrow
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-center max-w-2xl">
        <div className="bg-green-800/40 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Our Mission</h2>
          <p>
            Reducing e-waste through responsible recycling practices, education,
            and community engagement.
          </p>
        </div>

        <div className="bg-green-800/40 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Our Impact</h2>
          <p>
            Over 500,000 devices recycled, saving thousands of tons of e-waste
            from landfills.
          </p>
        </div>
      </div>

      <a
        href="/"
        className="mt-8 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full transition-all"
      >
        Visit Our Site
      </a>
    </div>
  );
}
