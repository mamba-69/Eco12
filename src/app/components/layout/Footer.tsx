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
import { motion } from "framer-motion";
import { useStore } from "@/app/lib/store";
import { useSettingsChangeListener } from "@/app/lib/sitebridge";
import { useEffect, useState, memo } from "react";

// Memoized motion components for better performance
const MotionDiv = memo(motion.div);

export default function Footer() {
  const { siteSettings, updateSiteSettings } = useStore();
  const [footerText, setFooterText] = useState<string>(
    `© ${new Date().getFullYear()} EcoExpert. All rights reserved.`
  );
  const [contactEmail, setContactEmail] = useState<string>(
    "experttechnology2016@gmail.com"
  );
  const [contactPhone, setContactPhone] = useState<string>("91+ 7096444414");
  const [contactAddress, setContactAddress] = useState<string>(
    "Unit 1116, 1117 & 1119, 11th Floor BPTP Park Centra, Sector 30 NH8, Gurgaon, Haryana 122001"
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
        siteSettings.contactEmail || "experttechnology2016@gmail.com"
      );
      setContactPhone(siteSettings.contactPhone || "91+ 7096444414");
      setContactAddress(
        siteSettings.contactAddress ||
          "Unit 1116, 1117 & 1119, 11th Floor BPTP Park Centra, Sector 30 NH8, Gurgaon, Haryana 122001"
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
    <footer className="bg-card pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <img
                src="https://i.postimg.cc/fbTQWhz9/Chat-GPT-Image-Apr-3-2025-09-48-35-PM.png"
                alt="Eco-Expert Recycling"
                className="w-10 h-10 mr-2 object-contain"
                onError={(e) => {
                  // Fallback to local logo if the remote one fails
                  const target = e.target as HTMLImageElement;
                  target.onerror = null; // Prevent infinite loop
                  target.src = "/images/logo.svg"; // Fallback to local logo
                }}
              />
              <h3 className="text-xl font-bold">Eco-Expert</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Transforming electronic waste into valuable resources for a
              sustainable future.
            </p>
            <div className="flex space-x-4">
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80"
              >
                <span className="sr-only">Twitter</span>
                <FaTwitter className="h-6 w-6" />
              </a>
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80"
              >
                <span className="sr-only">LinkedIn</span>
                <FaLinkedin className="h-6 w-6" />
              </a>
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80"
              >
                <span className="sr-only">Facebook</span>
                <FaFacebook className="h-6 w-6" />
              </a>
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80"
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
                <a
                  href="/services"
                  className="text-muted-foreground hover:text-primary"
                >
                  E-Waste Collection
                </a>
              </li>
              <li>
                <a
                  href="/services"
                  className="text-muted-foreground hover:text-primary"
                >
                  Data Destruction
                </a>
              </li>
              <li>
                <a
                  href="/services"
                  className="text-muted-foreground hover:text-primary"
                >
                  IT Asset Disposition
                </a>
              </li>
              <li>
                <a
                  href="/services"
                  className="text-muted-foreground hover:text-primary"
                >
                  Corporate Recycling
                </a>
              </li>
              <li>
                <a
                  href="/services"
                  className="text-muted-foreground hover:text-primary"
                >
                  E-Waste Compliance
                </a>
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

        <div className="border-t border-muted pt-6 mt-8 text-center text-muted-foreground text-sm">
          <p>{footerText}</p>
        </div>
      </div>
    </footer>
  );
}
