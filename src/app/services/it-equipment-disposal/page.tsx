"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FiCheck,
  FiArrowLeft,
  FiTrash2,
  FiShield,
  FiAward,
  FiFileText,
} from "react-icons/fi";

export default function ITEquipmentDisposalPage() {
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
          <span className="text-foreground">IT Equipment Disposal</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            IT Equipment Disposal
          </h1>
          <p className="text-lg mb-6 text-muted-foreground">
            Professional disposal services for outdated or broken IT equipment
            and electronics. We ensure your old technology is disposed of
            responsibly while protecting your data and the environment.
          </p>
          <div className="bg-primary/10 p-4 rounded-lg border border-primary/20 mb-6">
            <h3 className="font-medium text-primary mb-2">
              Why Choose Our IT Disposal Services?
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>Environmentally responsible disposal methods</span>
              </li>
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>Secure data destruction on all storage devices</span>
              </li>
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>Compliance with all relevant regulations</span>
              </li>
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>Detailed documentation and certificates</span>
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
            src="/images/service-it.svg"
            alt="IT equipment disposal service"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Services Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Our IT Disposal Services
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <FiTrash2 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Responsible Disposal</h3>
            <p className="text-muted-foreground">
              We ensure all IT equipment is disposed of in an environmentally
              responsible manner, with zero landfill policy and maximum resource
              recovery.
            </p>
          </div>
          <div className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <FiShield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Data Security</h3>
            <p className="text-muted-foreground">
              All storage devices undergo secure data destruction processes to
              ensure sensitive information cannot be recovered, protecting your
              organization.
            </p>
          </div>
          <div className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <FiAward className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Compliance</h3>
            <p className="text-muted-foreground">
              Our disposal processes comply with all relevant environmental and
              data protection regulations, providing you with peace of mind and
              legal protection.
            </p>
          </div>
        </div>
      </div>

      {/* Equipment Types Section */}
      <div className="mb-16 bg-card rounded-xl p-8 border border-border">
        <h2 className="text-3xl font-bold mb-8">Equipment We Handle</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Computing Equipment</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>Desktop computers and workstations</span>
              </li>
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>Laptops and notebooks</span>
              </li>
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>Servers and data center equipment</span>
              </li>
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>Tablets and mobile devices</span>
              </li>
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>Hard drives and storage devices</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">
              Peripherals & Office Equipment
            </h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>Monitors and displays</span>
              </li>
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>Printers, scanners, and copiers</span>
              </li>
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>Networking equipment (routers, switches)</span>
              </li>
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>Telecom equipment and phone systems</span>
              </li>
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>Keyboards, mice, and other peripherals</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Our Disposal Process</h2>
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Collection & Inventory</h3>
              <p className="text-muted-foreground">
                We collect your IT equipment and create a detailed inventory of
                all items, including make, model, and serial numbers for
                complete traceability.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Data Destruction</h3>
              <p className="text-muted-foreground">
                All storage devices undergo secure data destruction using
                certified methods to ensure complete removal of sensitive
                information.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Sorting & Dismantling</h3>
              <p className="text-muted-foreground">
                Equipment is sorted and dismantled to separate different
                materials and components for appropriate recycling or disposal
                methods.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
              4
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">
                Recycling & Resource Recovery
              </h3>
              <p className="text-muted-foreground">
                Materials are processed through specialized recycling streams to
                recover valuable resources and ensure proper handling of
                hazardous components.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
              5
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">
                Documentation & Certification
              </h3>
              <p className="text-muted-foreground">
                We provide comprehensive documentation including certificates of
                disposal and data destruction for your compliance records.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Compliance & Certification</h2>
        <div className="bg-card p-6 rounded-xl border border-border">
          <div className="flex items-center mb-4">
            <FiFileText className="w-8 h-8 text-primary mr-3" />
            <h3 className="text-xl font-bold">Documentation Provided</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Our IT equipment disposal services include comprehensive
            documentation to ensure compliance with environmental and data
            protection regulations:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>Certificate of Disposal</span>
              </li>
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>Data Destruction Certificate</span>
              </li>
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>Detailed Asset Register</span>
              </li>
            </ul>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>Environmental Compliance Report</span>
              </li>
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>Chain of Custody Documentation</span>
              </li>
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>Waste Transfer Notes</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary/10 rounded-xl p-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Dispose of Your IT Equipment Responsibly
        </h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto text-muted-foreground">
          Contact us today to discuss your IT equipment disposal needs and get a
          customized solution for your organization.
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
