"use client";

import dynamic from 'next/dynamic';

const DynamicAboutPage = dynamic(() => import('./page-content'), { ssr: false });

export default function AboutPage() {
  return <DynamicAboutPage />;
}
