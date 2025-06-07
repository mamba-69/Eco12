"use client";

import Image from "next/image";
import Link from "next/link";
import { FiCheck, FiArrowLeft } from "react-icons/fi";

export default function EWasteRecyclingPage() {
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
          <span className="text-foreground">E-Waste Recycling</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            E-Waste Recycling
          </h1>
          <p className="text-lg mb-6 text-muted-foreground">
            Our comprehensive e-waste recycling services ensure that electronic
            waste is processed responsibly, minimizing environmental impact
            while recovering valuable materials.
          </p>
          <div className="bg-primary/10 p-4 rounded-lg border border-primary/20 mb-6">
            <h3 className="font-medium text-primary mb-2">
              Why Choose Our Recycling Services?
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>Environmentally responsible processing methods</span>
              </li>
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>
                  Recovery of valuable materials like gold, silver, and copper
                </span>
              </li>
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>Compliance with all environmental regulations</span>
              </li>
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 text-primary flex-shrink-0" />
                <span>Detailed reporting and documentation</span>
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
            src="/images/ewaste-recycling-process.svg"
            alt="E-waste recycling process"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Process Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Our Recycling Process
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-card p-6 rounded-xl border border-border relative">
            <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              1
            </div>
            <h3 className="text-xl font-bold mb-3">Collection</h3>
            <p className="text-muted-foreground">
              We collect e-waste from businesses, organizations, and collection
              points, ensuring safe transportation to our facilities.
            </p>
          </div>
          <div className="bg-card p-6 rounded-xl border border-border relative">
            <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              2
            </div>
            <h3 className="text-xl font-bold mb-3">Sorting & Dismantling</h3>
            <p className="text-muted-foreground">
              E-waste is sorted by type and manually dismantled to separate
              components for appropriate processing.
            </p>
          </div>
          <div className="bg-card p-6 rounded-xl border border-border relative">
            <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              3
            </div>
            <h3 className="text-xl font-bold mb-3">Material Recovery</h3>
            <p className="text-muted-foreground">
              Advanced processes extract valuable materials like precious
              metals, copper, aluminum, and plastics for reuse.
            </p>
          </div>
          <div className="bg-card p-6 rounded-xl border border-border relative">
            <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              4
            </div>
            <h3 className="text-xl font-bold mb-3">Responsible Disposal</h3>
            <p className="text-muted-foreground">
              Any remaining materials that cannot be recycled are disposed of
              using environmentally responsible methods.
            </p>
          </div>
        </div>
      </div>

      {/* Materials Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8">What We Recycle</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-xl border border-border">
            <h3 className="text-xl font-bold mb-3">Consumer Electronics</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Computers and laptops</li>
              <li>• Monitors and displays</li>
              <li>• Printers and scanners</li>
              <li>• Mobile phones and tablets</li>
              <li>• Television sets</li>
            </ul>
          </div>
          <div className="bg-card p-6 rounded-xl border border-border">
            <h3 className="text-xl font-bold mb-3">Office Equipment</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Servers and networking equipment</li>
              <li>• Photocopiers</li>
              <li>• Telephones and PBX systems</li>
              <li>• UPS and power supplies</li>
              <li>• Office electronics</li>
            </ul>
          </div>
          <div className="bg-card p-6 rounded-xl border border-border">
            <h3 className="text-xl font-bold mb-3">Other Electronics</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Small household appliances</li>
              <li>• Audio and video equipment</li>
              <li>• Electronic tools</li>
              <li>• Gaming consoles</li>
              <li>• Circuit boards and components</li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary/10 rounded-xl p-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Ready to Recycle Your E-Waste Responsibly?
        </h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto text-muted-foreground">
          Contact us today to learn more about our e-waste recycling services
          and how we can help your organization dispose of electronic waste
          responsibly.
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
