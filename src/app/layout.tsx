import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "CyberShield India | साइबर सुरक्षा SaaS",
  description: "Affordable CERT-In Compliant Cybersecurity for Indian SMBs",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-[#0a0f1e] text-slate-200 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
