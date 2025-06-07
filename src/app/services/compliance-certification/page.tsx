import Image from "next/image";
import Link from "next/link";
import { FiCheck, FiArrowLeft } from "react-icons/fi";

export default function ComplianceCertificationPage() {
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
          <span className="text-foreground">Compliance Certification</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Compliance Certification
          </h1>
          <p className="text-lg mb-6 text-muted-foreground">
            Ensuring your business meets all regulatory requirements for e-waste
            disposal with our comprehensive compliance certification services.
          </p>
          <div className="bg-primary/10 p-4 rounded-lg border border-primary/20 mb-6">
            <h3 className="font-medium text-primary mb-2">
              Why Choose Our Compliance Services?
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>
                  Full compliance with local and international regulations
                </span>
              </li>
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>Detailed documentation and certification</span>
              </li>
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>Regular audits and compliance checks</span>
              </li>
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>Protection from legal liabilities</span>
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
            src="https://iili.io/F20DXmg.md.jpg"
            alt="Compliance certification services"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Compliance Standards Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Compliance Standards We Cover
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-xl border border-border">
            <h3 className="text-xl font-bold mb-3">E-Waste Management Rules</h3>
            <p className="text-muted-foreground">
              We ensure compliance with the latest E-Waste Management Rules,
              including proper collection, storage, transportation, and disposal
              of electronic waste.
            </p>
          </div>
          <div className="bg-card p-6 rounded-xl border border-border">
            <h3 className="text-xl font-bold mb-3">Environmental Compliance</h3>
            <p className="text-muted-foreground">
              Our services cover all environmental regulations related to
              e-waste disposal, including pollution control and hazardous waste
              management.
            </p>
          </div>
          <div className="bg-card p-6 rounded-xl border border-border">
            <h3 className="text-xl font-bold mb-3">International Standards</h3>
            <p className="text-muted-foreground">
              We adhere to international standards like ISO 14001 for
              environmental management and R2 (Responsible Recycling)
              certification for electronics recyclers.
            </p>
          </div>
        </div>
      </div>

      {/* Certification Process */}
      <div className="mb-16 bg-card rounded-xl p-8 border border-border">
        <h2 className="text-3xl font-bold mb-8">Our Certification Process</h2>
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Initial Assessment</h3>
              <p className="text-muted-foreground">
                We conduct a thorough assessment of your current e-waste
                management practices and identify areas that need improvement.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Implementation</h3>
              <p className="text-muted-foreground">
                We help you implement necessary changes to meet all regulatory
                requirements and best practices for e-waste management.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Documentation</h3>
              <p className="text-muted-foreground">
                We prepare comprehensive documentation of your e-waste
                management processes, including collection, transportation, and
                disposal.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
              4
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Certification</h3>
              <p className="text-muted-foreground">
                Upon successful implementation and verification, we issue
                compliance certificates that demonstrate your adherence to
                regulatory requirements.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
              5
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Ongoing Support</h3>
              <p className="text-muted-foreground">
                We provide continuous monitoring and support to ensure your
                business maintains compliance with evolving regulations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Benefits of Compliance Certification
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-card p-6 rounded-xl border border-border">
            <h3 className="text-xl font-bold mb-3">Legal Protection</h3>
            <p className="text-muted-foreground">
              Avoid penalties and legal issues by ensuring your business fully
              complies with all e-waste disposal regulations.
            </p>
          </div>
          <div className="bg-card p-6 rounded-xl border border-border">
            <h3 className="text-xl font-bold mb-3">Enhanced Reputation</h3>
            <p className="text-muted-foreground">
              Demonstrate your commitment to environmental responsibility,
              enhancing your company's reputation with customers and partners.
            </p>
          </div>
          <div className="bg-card p-6 rounded-xl border border-border">
            <h3 className="text-xl font-bold mb-3">Streamlined Operations</h3>
            <p className="text-muted-foreground">
              Implement efficient e-waste management processes that improve your
              overall operational efficiency.
            </p>
          </div>
          <div className="bg-card p-6 rounded-xl border border-border">
            <h3 className="text-xl font-bold mb-3">
              Documentation & Reporting
            </h3>
            <p className="text-muted-foreground">
              Receive comprehensive documentation and reports that can be used
              for audits, stakeholder communications, and sustainability
              reporting.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary/10 rounded-xl p-8 border border-primary/20 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Ensure Compliance?</h2>
        <p className="text-lg mb-6 max-w-3xl mx-auto">
          Contact us today to discuss your compliance certification needs and
          protect your business from regulatory risks.
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
