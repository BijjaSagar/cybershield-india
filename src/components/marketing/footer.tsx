import Link from "next/link";
import { Shield, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#060b18] border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">CyberShield India</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              साइबर सुरक्षा · Affordable CERT-In compliant cybersecurity SaaS built for India's 63 million SMBs.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              All data stored in India 🇮🇳
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              {["Threat Monitor","Incident Response","Log Vault","Compliance Dashboard","Vulnerability Scanner","Security Awareness","DPDP Act Suite","Access Guard"].map(f => (
                <li key={f}><a href="#features" className="hover:text-slate-200 transition-colors">{f}</a></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              {[
                { label: "About RH Technology", href: "#" },
                { label: "Pricing", href: "#pricing" },
                { label: "CERT-In Compliance", href: "#compliance" },
                { label: "Blog", href: "#" },
                { label: "Careers", href: "#" },
                { label: "Partner with us", href: "#" },
              ].map(l => (
                <li key={l.label}><a href={l.href} className="hover:text-slate-200 transition-colors">{l.label}</a></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-400" />
                RH Technology, Pune, Maharashtra 411001
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0 text-blue-400" />
                support@cybershield.in
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0 text-blue-400" />
                +91 20 XXXX XXXX
              </li>
            </ul>
            <div className="mt-6">
              <Link href="/signup" className="inline-flex px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-all">
                Start Free Trial →
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span>© 2026 RH Technology Pvt Ltd. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
            <a href="#" className="hover:text-slate-300">Security</a>
            <a href="#" className="hover:text-slate-300">CERT-In Disclosure</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
