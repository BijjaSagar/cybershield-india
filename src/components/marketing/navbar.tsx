"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { LogoMark } from "@/components/logo";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "CERT-In Compliance", href: "#compliance" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark size={32} />
          <div className="leading-tight">
            <span className="font-bold text-slate-800 text-sm tracking-tight">CyberShield</span>
            <span className="text-blue-600 text-sm font-bold"> India</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(l => (
            <a key={l.label} href={l.href} className="text-sm text-slate-600 hover:text-blue-600 transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-sm text-slate-600 hover:text-blue-600 font-medium transition-colors">
            Sign In
          </Link>
          <Link href="/signup" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all shadow-sm">
            Start Free Trial
          </Link>
        </div>

        {/* Mobile burger */}
        <button className="md:hidden text-slate-600" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-3 shadow-md">
          {navLinks.map(l => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)}
              className="block text-sm text-slate-700 hover:text-blue-600 py-1">
              {l.label}
            </a>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <Link href="/login" className="text-center py-2 rounded-lg border border-slate-300 text-slate-700 text-sm hover:border-blue-400 transition-colors">Sign In</Link>
            <Link href="/signup" className="text-center py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold">Start Free Trial</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
