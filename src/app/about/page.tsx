"use client";

import React from "react";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
                About Eco-Expert
              </h1>
              <p className="text-lg mb-6">
                We're on a mission to revolutionize e-waste recycling through
                innovative, sustainable solutions that protect our planet for
                future generations.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-card p-3 rounded-lg shadow-sm text-center flex-1 min-w-[150px]">
                  <h3 className="font-bold text-2xl text-primary">10+</h3>
                  <p className="text-muted-foreground">Years Experience</p>
                </div>
                <div className="bg-card p-3 rounded-lg shadow-sm text-center flex-1 min-w-[150px]">
                  <h3 className="font-bold text-2xl text-accent">500K+</h3>
                  <p className="text-muted-foreground">Devices Recycled</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex-1"
            >
              <div className="rounded-lg overflow-hidden shadow-md">
                <img
                  src="/images/about/team.jpg"
                  alt="Eco-Expert Team"
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://placehold.co/600x400/10B981/FFFFFF?text=Eco-Expert+Team";
                  }}
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
            <div className="space-y-6">
              <p>
                Founded in 2025, Eco-Expert was born from a simple observation:
                the growing mountain of electronic waste was becoming one of our
                planet's most pressing environmental concerns.
              </p>
              <p>
                Our company was founded by{" "}
                <span className="font-semibold text-primary">
                  Pankaj Patidar
                </span>{" "}
                with{" "}
                <span className="font-semibold text-primary">
                  Pushkar Patidar
                </span>{" "}
                as Co-founder. Together, they set out to create a company that
                would not only responsibly recycle e-waste but also recover
                valuable materials and promote a circular economy approach to
                electronics.
              </p>
              <p>
                What started as a small operation in a warehouse has grown into
                one of the region's leading e-waste recycling companies, with
                state-of-the-art facilities and partnerships with major
                technology manufacturers and retailers.
              </p>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-10 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-card p-6 rounded-lg shadow-sm"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">
                Environmental Stewardship
              </h3>
              <p className="text-muted-foreground">
                We're committed to reducing the environmental impact of e-waste
                through responsible recycling and recovery practices.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-card p-6 rounded-lg shadow-sm"
            >
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Innovation</h3>
              <p className="text-muted-foreground">
                We constantly seek new technologies and processes to improve our
                recycling efficiency and material recovery rates.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-card p-6 rounded-lg shadow-sm"
            >
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-secondary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Community Engagement</h3>
              <p className="text-muted-foreground">
                We believe in educating and engaging communities on the
                importance of e-waste recycling and sustainable practices.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Team Section */}
        <section>
          <h2 className="text-3xl font-bold mb-10 text-center">
            Our Leadership Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-card p-6 rounded-lg shadow-sm text-center"
            >
              <div className="w-24 h-24 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center text-primary text-xl font-bold">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-1.04-8.755-2.745M10 19l2-2 2 2M5 7.5V4a1 1 0 011-1h12a1 1 0 011 1v3.5m-3 0h-6M12 10a3 3 0 11-6 0 3 3 0 016 0zm-6 0a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-1">Pankaj Patidar</h3>
              <p className="text-muted-foreground">Founder</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-card p-6 rounded-lg shadow-sm text-center"
            >
              <div className="w-24 h-24 rounded-full bg-accent/10 mx-auto mb-4 flex items-center justify-center text-accent text-xl font-bold">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-1">Pushkar Patidar</h3>
              <p className="text-muted-foreground">Co-founder</p>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
