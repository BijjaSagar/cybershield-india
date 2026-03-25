"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  Shield, Activity, FileText, BarChart3, AlertTriangle,
  BookOpen, Lock, Settings, Bell, LogOut,
} from "lucide-react";
import { UpgradeButton } from "./upgrade-button";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: BarChart3 },
  { href: "/dashboard/threats", label: "Threat Monitor", icon: Activity },
  { href: "/dashboard/incidents", label: "Incident Response", icon: AlertTriangle },
  { href: "/dashboard/logs", label: "Log Vault", icon: FileText },
  { href: "/dashboard/compliance", label: "Compliance", icon: Shield },
  { href: "/dashboard/vulnerability", label: "Vulnerability Scan", icon: Lock },
  { href: "/dashboard/awareness", label: "Security Training", icon: BookOpen },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

const PLAN_LABELS: Record<string, string> = {
  KAVACH: "Kavach Basic",
  SURAKSHA: "Suraksha Pro",
  RAKSHAK: "Rakshak Enterprise",
};

const PLAN_EMPLOYEES: Record<string, string> = {
  KAVACH: "Up to 10 employees",
  SURAKSHA: "Up to 50 employees",
  RAKSHAK: "Up to 200 employees",
};

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const plan = (session?.user as any)?.plan ?? "SURAKSHA";
  const orgName = (session?.user as any)?.orgName ?? "Your Organisation";

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-slate-900/80 border-r border-slate-700/50 backdrop-blur-md flex flex-col z-40">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-700/50">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-white text-sm leading-tight">CyberShield</div>
            <div className="text-xs text-blue-400 leading-tight">India</div>
          </div>
        </Link>
      </div>

      {/* Live indicator */}
      <div className="px-5 py-3 border-b border-slate-700/30">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
          Monitoring Active
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                active
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/40"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-3 border-t border-slate-700/50 space-y-0.5">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-700/40 transition-all">
          <Bell className="w-4 h-4" />
          Notifications
        </button>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      {/* Plan badge */}
      <div className="px-4 pb-4 space-y-2">
        <div className="rounded-lg bg-blue-600/10 border border-blue-500/20 px-3 py-2 overflow-hidden">
          <div className="text-xs text-blue-400 font-semibold truncate">{PLAN_LABELS[plan]}</div>
          <div className="text-xs text-slate-500 truncate">{orgName}</div>
          <div className="text-xs text-slate-600 truncate">{PLAN_EMPLOYEES[plan]}</div>
        </div>
        <UpgradeButton plan={plan} />
      </div>
    </aside>
  );
}
