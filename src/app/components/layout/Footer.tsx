"use client";

import Link from "next/link";
import Image from "next/image";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { motion } from "framer-motion";
import { useStore } from "@/app/lib/store";
import { useSettingsChangeListener } from "@/app/lib/sitebridge";
import { useEffect, useState, memo } from "react";

// Memoized motion components for better performance
const MotionDiv = memo(motion.div);

export default function Footer() {
  return (
    <footer className="bg-card pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Eco-Expert</h3>
            <p className="text-muted-foreground mb-4">
              Transforming electronic waste into valuable resources for a sustainable future.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-primary hover:text-primary/80">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="text-primary hover:text-primary/80">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-muted-foreground hover:text-primary">Home</a></li>
              <li><a href="/about" className="text-muted-foreground hover:text-primary">About Us</a></li>
              <li><a href="/services" className="text-muted-foreground hover:text-primary">Services</a></li>
              <li><a href="/blog" className="text-muted-foreground hover:text-primary">Blog</a></li>
              <li><a href="/contact" className="text-muted-foreground hover:text-primary">Contact</a></li>
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="text-xl font-bold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><a href="/services" className="text-muted-foreground hover:text-primary">E-Waste Collection</a></li>
              <li><a href="/services" className="text-muted-foreground hover:text-primary">Data Destruction</a></li>
              <li><a href="/services" className="text-muted-foreground hover:text-primary">IT Asset Disposition</a></li>
              <li><a href="/services" className="text-muted-foreground hover:text-primary">Corporate Recycling</a></li>
              <li><a href="/services" className="text-muted-foreground hover:text-primary">E-Waste Compliance</a></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <address className="not-italic text-muted-foreground">
              <p className="mb-2">123 Green Street</p>
              <p className="mb-2">Mumbai, Maharashtra 400001</p>
              <p className="mb-2">India</p>
              <p className="mb-2">Phone: +91 98765 43210</p>
              <p className="mb-2">Email: info@eco-expert.in</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-muted pt-6 mt-8 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} Eco-Expert Recycling Pvt. Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 