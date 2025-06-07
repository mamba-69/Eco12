import Image from "next/image";
import Link from "next/link";
import { FiCheck, FiArrowLeft } from "react-icons/fi";

export default function AssetRecoveryPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Breadcrumb */}
      <div className="mb-8">
        <div className="flex items-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link
            href="/services"
            className="hover:text-primary transition-colors"
          >
            Services
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Asset Recovery</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Asset Recovery
          </h1>
          <p className="text-lg mb-6 text-muted-foreground">
            Maximize the value of your end-of-life IT equipment through our
            comprehensive asset recovery services, turning potential waste into
            financial returns.
          </p>
          <div className="bg-primary/10 p-4 rounded-lg border border-primary/20 mb-6">
            <h3 className="font-medium text-primary mb-2">
              Why Choose Our Asset Recovery Services?
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>Maximize financial returns from retired IT assets</span>
              </li>
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>
                  Environmentally responsible disposal of non-recoverable items
                </span>
              </li>
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>Secure data destruction on all recovered assets</span>
              </li>
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>Detailed reporting and asset tracking</span>
              </li>
            </ul>
          </div>
          <Link
            href="/contact"
            className="btn-primary inline-flex items-center"
          >
            Request Service
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
        <div className="relative rounded-xl overflow-hidden shadow-xl h-[400px]">
          <Image
            src="/images/service-epr.svg"
            alt="Asset recovery services"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Asset Recovery Solutions Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Our Asset Recovery Solutions
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-xl border border-border">
            <h3 className="text-xl font-bold mb-3">IT Equipment Resale</h3>
            <p className="text-muted-foreground">
              We refurbish and resell functional IT equipment, providing you
              with a share of the resale value and extending the lifecycle of
              valuable technology.
            </p>
          </div>
          <div className="bg-card p-6 rounded-xl border border-border">
            <h3 className="text-xl font-bold mb-3">Parts Harvesting</h3>
            <p className="text-muted-foreground">
              We extract valuable components from non-functional equipment for
              reuse or resale, maximizing recovery value from otherwise unusable
              assets.
            </p>
          </div>
          <div className="bg-card p-6 rounded-xl border border-border">
            <h3 className="text-xl font-bold mb-3">Material Recovery</h3>
            <p className="text-muted-foreground">
              We recover precious metals and other valuable materials from
              electronic waste through advanced recycling processes, turning
              waste into resources.
            </p>
          </div>
        </div>
      </div>

      {/* Asset Recovery Process */}
      <div className="mb-16 bg-card rounded-xl p-8 border border-border">
        <h2 className="text-3xl font-bold mb-8">Our Asset Recovery Process</h2>
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Asset Evaluation</h3>
              <p className="text-muted-foreground">
                We conduct a thorough assessment of your IT assets to determine
                their condition, market value, and potential for recovery.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">
                Secure Data Destruction
              </h3>
              <p className="text-muted-foreground">
                We perform certified data destruction on all storage devices to
                ensure your sensitive information is completely and securely
                erased.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Refurbishment</h3>
              <p className="text-muted-foreground">
                Functional equipment is cleaned, tested, and refurbished to
                prepare it for resale in the secondary market.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
              4
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Remarketing</h3>
              <p className="text-muted-foreground">
                We leverage our extensive network to find buyers for your
                refurbished equipment, maximizing the return value.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
              5
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Revenue Sharing</h3>
              <p className="text-muted-foreground">
                We provide you with a share of the revenue generated from the
                resale of your assets, along with detailed reporting.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Benefits of Asset Recovery
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-card p-6 rounded-xl border border-border">
            <h3 className="text-xl font-bold mb-3">Financial Returns</h3>
            <p className="text-muted-foreground">
              Recover value from end-of-life IT assets, turning potential waste
              disposal costs into revenue opportunities.
            </p>
          </div>
          <div className="bg-card p-6 rounded-xl border border-border">
            <h3 className="text-xl font-bold mb-3">
              Environmental Sustainability
            </h3>
            <p className="text-muted-foreground">
              Extend the lifecycle of IT equipment and ensure proper recycling
              of materials, reducing environmental impact and supporting
              circular economy principles.
            </p>
          </div>
          <div className="bg-card p-6 rounded-xl border border-border">
            <h3 className="text-xl font-bold mb-3">Data Security</h3>
            <p className="text-muted-foreground">
              Ensure all sensitive data is securely destroyed before assets are
              refurbished or recycled, protecting your organization from data
              breaches.
            </p>
          </div>
          <div className="bg-card p-6 rounded-xl border border-border">
            <h3 className="text-xl font-bold mb-3">Compliance</h3>
            <p className="text-muted-foreground">
              Meet regulatory requirements for proper disposal of electronic
              waste while maintaining detailed records for audit purposes.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary/10 rounded-xl p-8 border border-primary/20 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Recover Value from Your IT Assets?
        </h2>
        <p className="text-lg mb-6 max-w-3xl mx-auto">
          Contact us today to discuss how our asset recovery services can help
          you maximize returns from your end-of-life IT equipment.
        </p>
        <Link href="/contact" className="btn-primary inline-flex items-center">
          Get Started
          <svg
            className="ml-2 w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
