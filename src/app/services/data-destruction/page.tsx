"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FiCheck,
  FiArrowLeft,
  FiShield,
  FiFileText,
  FiServer,
  FiHardDrive,
} from "react-icons/fi";

export default function DataDestructionPage() {
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
          <span className="text-foreground">Data Destruction</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Secure Data Destruction
          </h1>
          <p className="text-lg mb-6 text-muted-foreground">
            Our certified data destruction services ensure that sensitive
            information is completely and securely erased from all devices
            before recycling or disposal, protecting your organization from data
            breaches and compliance issues.
          </p>
          <div className="bg-primary/10 p-4 rounded-lg border border-primary/20 mb-6">
            <h3 className="font-medium text-primary mb-2">
              Why Choose Our Data Destruction Services?
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>
                  Certified data wiping and physical destruction methods
                </span>
              </li>
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>Detailed certificates of destruction for compliance</span>
              </li>
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>Secure chain of custody throughout the process</span>
              </li>
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>Compliance with GDPR, HIPAA, and other regulations</span>
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
            src="/images/service-logistics.svg"
            alt="Data destruction services"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Methods Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Our Data Destruction Methods
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <FiHardDrive className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Software Wiping</h3>
            <p className="text-muted-foreground">
              Using DoD-compliant data wiping software that overwrites data
              multiple times, making it impossible to recover even with advanced
              recovery tools.
            </p>
          </div>
          <div className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <FiServer className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Physical Destruction</h3>
            <p className="text-muted-foreground">
              For storage devices that cannot be wiped or require the highest
              level of security, we offer physical destruction services that
              render the media completely unusable.
            </p>
          </div>
          <div className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <FiFileText className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Certification</h3>
            <p className="text-muted-foreground">
              We provide detailed certificates of destruction for each device
              processed, including serial numbers and destruction methods for
              your compliance records.
            </p>
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="mb-16 bg-card rounded-xl p-8 border border-border">
        <h2 className="text-3xl font-bold mb-8">Our Secure Process</h2>
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Secure Collection</h3>
              <p className="text-muted-foreground">
                We collect your devices using secure transport methods with GPS
                tracking and maintain a documented chain of custody throughout
                the process.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Inventory & Assessment</h3>
              <p className="text-muted-foreground">
                Each device is logged with its serial number and specifications,
                and we determine the appropriate destruction method based on
                device type and security requirements.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Data Destruction</h3>
              <p className="text-muted-foreground">
                We perform the data destruction using the appropriate method,
                whether it's software wiping with multiple passes or physical
                destruction of the media.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
              4
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">
                Verification & Certification
              </h3>
              <p className="text-muted-foreground">
                Our technicians verify that the destruction was successful, and
                we provide detailed certificates of destruction for your
                compliance records.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Compliance & Standards</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-card p-6 rounded-xl border border-border">
            <div className="flex items-center mb-4">
              <FiShield className="w-8 h-8 text-primary mr-3" />
              <h3 className="text-xl font-bold">Regulatory Compliance</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Our data destruction services help you comply with various data
              protection regulations and standards, including:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• GDPR (General Data Protection Regulation)</li>
              <li>
                • HIPAA (Health Insurance Portability and Accountability Act)
              </li>
              <li>• PCI DSS (Payment Card Industry Data Security Standard)</li>
              <li>• NIST 800-88 Guidelines for Media Sanitization</li>
              <li>• ISO/IEC 27001 Information Security Management</li>
            </ul>
          </div>
          <div className="bg-card p-6 rounded-xl border border-border">
            <div className="flex items-center mb-4">
              <FiFileText className="w-8 h-8 text-primary mr-3" />
              <h3 className="text-xl font-bold">Documentation Provided</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              We provide comprehensive documentation for your records,
              including:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Certificate of Data Destruction for each device</li>
              <li>• Detailed inventory report with serial numbers</li>
              <li>• Chain of custody documentation</li>
              <li>• Destruction method verification</li>
              <li>• Environmental compliance certification</li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary/10 rounded-xl p-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Protect Your Sensitive Data Today
        </h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto text-muted-foreground">
          Don't risk your organization's data falling into the wrong hands.
          Contact us today to learn more about our secure data destruction
          services.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contact"
            className="btn-primary inline-flex items-center justify-center"
          >
            Contact Us
          </Link>
          <Link
            href="/services"
            className="btn-outline inline-flex items-center justify-center"
          >
            <FiArrowLeft className="mr-2" />
            Back to Services
          </Link>
        </div>
      </div>
    </div>
  );
}
