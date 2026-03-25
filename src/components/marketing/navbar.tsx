"use client";
import { useState } from "react";
import Link from "next/link";
import { Shield, Menu, X } from "lucide-react";

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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0f1e]/90 backdrop-blur-md border-b border-slate-700/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-bold text-white text-sm">CyberShield</span>
            <span className="text-blue-400 text-sm font-bold"> India</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(l => (
            <a key={l.label} href={l.href} className="text-sm text-slate-400 hover:text-white transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link href="#pricing" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all">
            Start Free Trial
          </Link>
        </div>

        {/* Mobile burger */}
        <button className="md:hidden text-slate-400" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#0d1424] border-t border-slate-700/40 px-4 py-4 space-y-3">
          {navLinks.map(l => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)}
              className="block text-sm text-slate-300 hover:text-white py-1">
              {l.label}
            </a>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <Link href="/login" className="text-center py-2 rounded-lg border border-slate-600 text-slate-300 text-sm">Sign In</Link>
            <Link href="#pricing" className="text-center py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold">Start Free Trial</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
