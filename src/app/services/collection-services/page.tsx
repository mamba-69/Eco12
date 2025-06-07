"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FiCheck,
  FiArrowLeft,
  FiTruck,
  FiPackage,
  FiCalendar,
  FiClipboard,
} from "react-icons/fi";

export default function CollectionServicesPage() {
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
          <span className="text-foreground">Collection Services</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            E-Waste Collection Services
          </h1>
          <p className="text-lg mb-6 text-muted-foreground">
            We provide comprehensive collection solutions for businesses and
            organizations with large volumes of electronic waste. Our efficient
            logistics network ensures your e-waste is collected safely and
            responsibly.
          </p>
          <div className="bg-primary/10 p-4 rounded-lg border border-primary/20 mb-6">
            <h3 className="font-medium text-primary mb-2">
              Why Choose Our Collection Services?
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>Customized collection schedules to meet your needs</span>
              </li>
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>Secure chain of custody for all collected items</span>
              </li>
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>
                  Detailed inventory and tracking of all collected e-waste
                </span>
              </li>
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>Environmentally responsible transportation methods</span>
              </li>
            </ul>
          </div>
          <Link
            href="/contact"
            className="btn-primary inline-flex items-center"
          >
            Schedule Collection
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
            src="/images/earth-graphic.png"
            alt="Collection services"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Collection Options Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Our Collection Options
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <FiTruck className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">On-Site Collection</h3>
            <p className="text-muted-foreground">
              Our team comes to your location to collect e-waste directly from
              your premises, minimizing disruption to your operations and
              ensuring secure handling.
            </p>
          </div>
          <div className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <FiCalendar className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Scheduled Pick-ups</h3>
            <p className="text-muted-foreground">
              Set up regular collection schedules tailored to your
              organization's needs, whether weekly, monthly, or quarterly, to
              manage consistent e-waste volumes.
            </p>
          </div>
          <div className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <FiPackage className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Bulk Collection</h3>
            <p className="text-muted-foreground">
              For large-scale projects, office relocations, or IT refreshes, we
              offer specialized bulk collection services with appropriate
              equipment and personnel.
            </p>
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="mb-16 bg-card rounded-xl p-8 border border-border">
        <h2 className="text-3xl font-bold mb-8">Our Collection Process</h2>
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Initial Assessment</h3>
              <p className="text-muted-foreground">
                We evaluate your e-waste volume, types of equipment, and
                location to determine the most efficient collection approach for
                your organization.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Scheduling</h3>
              <p className="text-muted-foreground">
                We work with you to establish a collection schedule that
                minimizes disruption to your operations while ensuring timely
                removal of e-waste.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Collection & Inventory</h3>
              <p className="text-muted-foreground">
                Our trained team arrives at your location, collects the e-waste,
                and creates a detailed inventory of all items collected,
                including make, model, and serial numbers.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
              4
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Secure Transport</h3>
              <p className="text-muted-foreground">
                All collected e-waste is securely transported to our processing
                facility using GPS-tracked vehicles and maintaining a documented
                chain of custody.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
              5
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">
                Documentation & Reporting
              </h3>
              <p className="text-muted-foreground">
                We provide comprehensive documentation of the collection,
                including inventory reports, chain of custody records, and
                certificates of recycling or destruction.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Equipment Types Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Equipment We Collect</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-card p-6 rounded-xl border border-border">
            <h3 className="text-xl font-bold mb-4">IT Equipment</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>Computers, laptops, and servers</span>
              </li>
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>Monitors, keyboards, and mice</span>
              </li>
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>Printers, scanners, and copiers</span>
              </li>
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>Networking equipment and telecom systems</span>
              </li>
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>Hard drives and storage devices</span>
              </li>
            </ul>
          </div>
          <div className="bg-card p-6 rounded-xl border border-border">
            <h3 className="text-xl font-bold mb-4">Other Electronics</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>Mobile phones and tablets</span>
              </li>
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>Audio/visual equipment</span>
              </li>
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>Medical and laboratory equipment</span>
              </li>
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>Office electronics and peripherals</span>
              </li>
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>Batteries and power supplies</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Compliance Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Compliance & Documentation</h2>
        <div className="bg-card p-6 rounded-xl border border-border">
          <div className="flex items-center mb-4">
            <FiClipboard className="w-8 h-8 text-primary mr-3" />
            <h3 className="text-xl font-bold">Complete Documentation</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Our collection services include comprehensive documentation to
            ensure compliance with environmental regulations and provide you
            with a complete audit trail:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>Detailed inventory reports</span>
              </li>
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>Chain of custody documentation</span>
              </li>
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>Certificates of recycling</span>
              </li>
            </ul>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>Environmental compliance records</span>
              </li>
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>Data destruction certificates (if applicable)</span>
              </li>
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>Asset recovery reports (if applicable)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary/10 rounded-xl p-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Ready to Schedule Your E-Waste Collection?
        </h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto text-muted-foreground">
          Contact us today to discuss your e-waste collection needs and get a
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
