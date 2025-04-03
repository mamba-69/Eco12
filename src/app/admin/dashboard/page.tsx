"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();

  // Redirect to login if not admin
  useEffect(() => {
    if (!isAdmin) {
      router.push("/auth/login");
    }
  }, [isAdmin, router]);

  if (!isAdmin) {
    return (
      <div className="container py-20">
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Access Denied</h1>
          <p style={{ marginBottom: "1rem" }}>
            You do not have permission to access this page.
          </p>
          <Link href="/auth/login" className="btn btn-primary">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div style={{ 
        background: "linear-gradient(135deg, #1a2e35 0%, #0d4b3f 100%)", 
        padding: "1.5rem", 
        borderRadius: "0.5rem", 
        marginBottom: "2rem",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h1 style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#ffffff" }}>Admin Dashboard</h1>
          <div>
            <span style={{ 
              backgroundColor: "#10B981", 
              color: "white", 
              padding: "0.25rem 0.75rem", 
              borderRadius: "9999px", 
              fontSize: "0.75rem",
              fontWeight: "bold"
            }}>
              Admin
            </span>
          </div>
        </div>
        <p style={{ color: "#a3e635" }}>Welcome back, {user?.user_metadata?.full_name || user?.email}</p>
      </div>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", 
        gap: "1.5rem" 
      }}>
        {/* Main management cards */}
        <DashboardCard
          title="Content Management"
          value="🖼️"
          description="Manage homepage content, mission statements, and achievements"
          link="/admin/content"
          isPrimary={true}
        />
        <DashboardCard
          title="Media Library"
          value="🎬"
          description="Upload and manage images, videos, and graphics"
          link="/admin/media"
          isPrimary={true}
        />
        <DashboardCard
          title="Theme Settings"
          value="🎨"
          description="Customize colors, fonts, and site appearance"
          link="/admin/settings/appearance"
          isPrimary={true}
        />
        <DashboardCard
          title="Footer Editor"
          value="📝"
          description="Edit contact info, social links, and footer sections"
          link="/admin/settings/footer"
          isPrimary={true}
        />
        
        {/* Secondary cards */}
        <DashboardCard
          title="Users"
          value="124"
          description="Manage user accounts"
          link="/admin/users"
        />
        <DashboardCard
          title="Analytics"
          value="📊"
          description="View site traffic and performance metrics"
          link="/admin/analytics"
        />
        <DashboardCard
          title="Feedback"
          value="💬"
          description="Customer messages and feedback"
          link="/admin/feedback"
        />
      </div>

      <div style={{ marginTop: "2.5rem" }}>
        <h2 style={{ 
          fontSize: "1.25rem", 
          fontWeight: "bold", 
          marginBottom: "1rem",
          borderLeft: "4px solid #10B981",
          paddingLeft: "0.75rem"
        }}>
          Recent Activity
        </h2>
        <div style={{ 
          backgroundColor: "#1F2937", 
          padding: "1rem", 
          borderRadius: "0.5rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
        }}>
          <ActivityItem 
            action="Content updated" 
            detail="Homepage hero section"
            time="10 minutes ago"
          />
          <ActivityItem 
            action="New media uploaded" 
            detail="3 images added to gallery"
            time="2 hours ago"
          />
          <ActivityItem 
            action="Theme colors updated" 
            detail="Primary color changed"
            time="1 day ago"
          />
          <ActivityItem 
            action="New user registered" 
            detail="john.doe@example.com"
            time="3 days ago"
            isLast={true}
          />
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ 
  title, 
  value, 
  description, 
  link,
  isPrimary = false
}: { 
  title: string; 
  value: string; 
  description: string; 
  link: string;
  isPrimary?: boolean;
}) {
  return (
    <Link href={link} style={{ textDecoration: "none" }}>
      <div style={{ 
        background: isPrimary 
          ? "linear-gradient(135deg, #0f766e 0%, #115e59 100%)" 
          : "#1F2937",
        padding: "1.5rem", 
        borderRadius: "0.75rem",
        transition: "all 0.3s ease",
        cursor: "pointer",
        height: "100%",
        border: isPrimary ? "none" : "1px solid #374151",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
      }} 
      className="hover-card"
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 10px 15px rgba(0, 0, 0, 0.2)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
      }}>
        <div style={{ 
          marginBottom: "0.5rem", 
          opacity: 0.9, 
          fontSize: "0.875rem",
          color: isPrimary ? "#a3e635" : "#9CA3AF"
        }}>
          {title}
        </div>
        <div style={{ 
          fontSize: isPrimary ? "2.25rem" : "1.875rem", 
          fontWeight: "bold", 
          marginBottom: "0.75rem",
          color: isPrimary ? "#ffffff" : "#2ECC71" 
        }}>
          {value}
        </div>
        <div style={{ 
          fontSize: "0.875rem", 
          opacity: isPrimary ? 0.9 : 0.8,
          color: isPrimary ? "#ffffff" : "#D1D5DB"
        }}>
          {description}
        </div>
      </div>
    </Link>
  );
}

function ActivityItem({
  action,
  detail,
  time,
  isLast = false
}: {
  action: string;
  detail: string;
  time: string;
  isLast?: boolean;
}) {
  return (
    <div style={{ 
      marginBottom: isLast ? 0 : "0.75rem", 
      padding: "0.75rem", 
      borderBottom: isLast ? "none" : "1px solid #374151",
      transition: "background-color 0.2s ease",
      borderRadius: "0.25rem",
      cursor: "pointer"
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.backgroundColor = "#2D3748";
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.backgroundColor = "transparent";
    }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontWeight: "500" }}>{action}</div>
        <div style={{ fontSize: "0.75rem", opacity: 0.7 }}>{time}</div>
      </div>
      <div style={{ fontSize: "0.875rem", opacity: 0.8, marginTop: "0.25rem" }}>
        {detail}
      </div>
    </div>
  );
} 