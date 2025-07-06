"use client";

import Link from "next/link";
import Image from "next/image";
import { FiMail, FiPhone, FiMapPin } from "@/app/lib/icons";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "@/app/lib/icons";
import { useStore } from "@/app/lib/store";
import { useSettingsChangeListener } from "@/app/lib/sitebridge";
import { useEffect, useState, memo } from "react";
import dynamic from "next/dynamic";

// Dynamically import motion components
const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  { ssr: false }
);

export default function Footer() {
  const { siteSettings, updateSiteSettings } = useStore();
  const [footerText, setFooterText] = useState<string>(
    `© ${new Date().getFullYear()} EcoExpert. All rights reserved.`
  );
  const [contactEmail, setContactEmail] = useState<string>(
    "Ecoexpertrecyling@gmail.com"
  );
  const [contactPhone, setContactPhone] = useState<string>("91+ 7096444414");
  const [contactAddress, setContactAddress] = useState<string>(
    "Survey No. 209/1/2, Ward No. 08, Ambedkar Ward, Neemuch City, Neemuch-458441, Madhya Pradesh."
  );
  const [socialLinks, setSocialLinks] = useState({
    facebook: "https://facebook.com",
    twitter: "https://twitter.com",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
  });

  // Load initial values from store
  useEffect(() => {
    if (siteSettings) {
      setFooterText(
        siteSettings.footerText ||
          `© ${new Date().getFullYear()} EcoExpert. All rights reserved.`
      );
      setContactEmail(
        siteSettings.contactEmail || "Ecoexpertrecycling@gmail.com"
      );
      setContactPhone(siteSettings.contactPhone || "91+ 7096444414");
      setContactAddress(
        siteSettings.contactAddress ||
          "Survey No. 209/1/2, Ward No. 08, Ambedkar Ward, Neemuch City, Neemuch-458441, Madhya Pradesh."
      );
      setSocialLinks(
        siteSettings.socialLinks || {
          facebook: "https://facebook.com",
          twitter: "https://twitter.com",
          instagram: "https://instagram.com",
          linkedin: "https://linkedin.com",
        }
      );
    }
  }, [siteSettings]);

  // Listen for settings changes from admin panel
  useSettingsChangeListener((data) => {
    if (data.settings) {
      // Update footer text if changed
      if (data.settings.footerText) {
        setFooterText(data.settings.footerText);
      }

      // Update contact info if changed
      if (data.settings.contactEmail) {
        setContactEmail(data.settings.contactEmail);
      }
      if (data.settings.contactPhone) {
        setContactPhone(data.settings.contactPhone);
      }
      if (data.settings.contactAddress) {
        setContactAddress(data.settings.contactAddress);
      }

      // Update social links if changed
      if (data.settings.socialLinks) {
        setSocialLinks(data.settings.socialLinks);
      }

      console.log("Footer updated from admin panel:", data.source);
    }
  });

  const addressLines = contactAddress.split("\n");

  return (
    <footer className="footer bg-gray-900 text-white pt-12 pb-6 relative z-10 mt-20 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <img
                src="https://iili.io/FlMGxUJ.png"
                alt="Eco-Expert Recycling"
                className="w-16 h-16 mr-2 object-contain"
                onError={(e) => {
                  // Fallback to placeholder if the remote one fails
                  const target = e.target as HTMLImageElement;
                  target.onerror = null; // Prevent infinite loop
                  target.src =
                    "https://placehold.co/100x100/22c55e/ffffff?text=EE";
                }}
              />
              <h3 className="text-xl font-bold">Eco-Expert</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Transforming electronic waste into valuable resources for a
              sustainable future.
            </p>
            <div className="flex space-x-4">
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-500 hover:text-green-400"
              >
                <span className="sr-only">Twitter</span>
                <FaTwitter className="h-6 w-6" />
              </a>
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-500 hover:text-green-400"
              >
                <span className="sr-only">LinkedIn</span>
                <FaLinkedin className="h-6 w-6" />
              </a>
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-500 hover:text-green-400"
              >
                <span className="sr-only">Facebook</span>
                <FaFacebook className="h-6 w-6" />
              </a>
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-500 hover:text-green-400"
              >
                <span className="sr-only">Instagram</span>
                <FaInstagram className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-muted-foreground hover:text-primary"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-muted-foreground hover:text-primary"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/services"
                  className="text-muted-foreground hover:text-primary"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  className="text-muted-foreground hover:text-primary"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-muted-foreground hover:text-primary"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-bold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/services/e-waste-recycling"
                  className="text-muted-foreground hover:text-primary"
                >
                  E-Waste Recycling
                </Link>
              </li>
              <li>
                <Link
                  href="/services/data-destruction"
                  className="text-muted-foreground hover:text-primary"
                >
                  Data Destruction
                </Link>
              </li>
              <li>
                <Link
                  href="/services/collection-services"
                  className="text-muted-foreground hover:text-primary"
                >
                  Collection Services
                </Link>
              </li>
              <li>
                <Link
                  href="/services/compliance-certification"
                  className="text-muted-foreground hover:text-primary"
                >
                  Compliance Certification
                </Link>
              </li>
              <li>
                <Link
                  href="/services/asset-recovery"
                  className="text-muted-foreground hover:text-primary"
                >
                  Asset Recovery
                </Link>
              </li>
              <li>
                <Link
                  href="/services/it-equipment-disposal"
                  className="text-muted-foreground hover:text-primary"
                >
                  IT Equipment Disposal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <address className="not-italic text-muted-foreground">
              {addressLines.map((line, i) => (
                <p key={i} className="mb-2 flex items-start">
                  {i === 0 && <FiMapPin className="mr-2 mt-1 flex-shrink-0" />}
                  <span>{line}</span>
                </p>
              ))}
              <p className="mb-2 flex items-center">
                <FiPhone className="mr-2 flex-shrink-0" />
                <span>{contactPhone}</span>
              </p>
              <p className="mb-2 flex items-center">
                <FiMail className="mr-2 flex-shrink-0" />
                <a
                  href={`mailto:${contactEmail}`}
                  className="hover:underline hover:text-primary"
                >
                  {contactEmail}
                </a>
              </p>
            </address>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-800">
          <p className="text-center text-gray-400 text-sm">{footerText}</p>
        </div>

        {/* Clear separation from admin dashboard */}
        <div className="mt-20"></div>
      </div>
    </footer>
  );
}
