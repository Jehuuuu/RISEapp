import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Dashboard - RISE Investor",
  description: "Your investment dashboard",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0EA5E9",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 