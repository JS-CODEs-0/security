import type { Metadata, Viewport } from "next";
import "./globals.css";
import "@/shaders/threeui.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#09060e",
};

export const metadata: Metadata = {
  title: "Digital Safety Intelligence — Seven Field Guides for Cyber Defense",
  description:
    "An interactive ThreeUI 3D bookshelf featuring seven tactile volumes on threat telemetry, zero trust, offensive ops, autonomous defense, cloud bastions, neural shielding, and post-quantum cryptography.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#080808] text-white antialiased selection:bg-[#c87046] selection:text-white overflow-hidden">
        {children}
      </body>
    </html>
  );
}
