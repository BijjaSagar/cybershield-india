"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  Shield, Eye, EyeOff, Lock, Mail, User, Building2,
  Phone, AlertCircle, CheckCircle2, ChevronRight,
} from "lucide-react";

const plans = [
  {
    id: "kavach",
    name: "Kavach Basic",
    price: "₹999/mo",
    employees: "1–10 employees",
    color: "border-slate-600",
  },
  {
    id: "suraksha",
    name: "Suraksha Pro",
    price: "₹2,499/mo",
    employees: "10–50 employees",
    color: "border-blue-500",
    popular: true,
  },
  {
    id: "rakshak",
    name: "Rakshak Enterprise",
    price: "₹3,999/mo",
    employees: "50–200 employees",
    color: "border-purple-500",
  },
];

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("suraksha");

  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setError("");
  }

  function handleStep1(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setError("");
    setStep(2);
  }

  async function handleSignup() {
    setLoading(true);
    setError("");
    try {
      // 1. Register user
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          company: form.company,
          plan: selectedPlan,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      // 2. Auto sign in after registration
      const signInRes = await signIn("credentials", {
        email: form.email.toLowerCase(),
        password: form.password,
        redirect: false,
      });

      if (signInRes?.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        // Registration worked but auto-login failed — send to login
        router.push("/login?registered=1");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error. Check your connection.";
      setError(msg);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f1e] px-4 py-12">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />

      <div className="w-full max-w-lg relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 mb-4">
            <Shield className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">CyberShield India</h1>
          <p className="text-slate-400 text-sm mt-1">Start your free 14-day trial — no credit card required</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className={`flex items-center gap-2 text-sm font-medium ${step >= 1 ? "text-blue-400" : "text-slate-500"}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${step > 1 ? "bg-blue-600 border-blue-600 text-white" : step === 1 ? "border-blue-500 text-blue-400" : "border-slate-600 text-slate-500"}`}>
              {step > 1 ? <CheckCircle2 className="w-4 h-4" /> : "1"}
            </span>
            Account Details
          </div>
          <ChevronRight className="w-4 h-4 text-slate-600" />
          <div className={`flex items-center gap-2 text-sm font-medium ${step >= 2 ? "text-blue-400" : "text-slate-500"}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${step === 2 ? "border-blue-500 text-blue-400" : "border-slate-600 text-slate-500"}`}>
              2
            </span>
            Choose Plan
          </div>
        </div>

        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-sm p-8">

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <h2 className="text-lg font-semibold text-white mb-6">Create your account</h2>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleStep1} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1.5">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)}
                        placeholder="Rahul Sharma" required
                        className="w-full bg-slate-900/60 border border-slate-700/50 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1.5">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)}
                        placeholder="+91 98765 43210" required
                        className="w-full bg-slate-900/60 border border-slate-700/50 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">Company Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="text" value={form.company} onChange={(e) => update("company", e.target.value)}
                      placeholder="Sharma Enterprises Pvt Ltd" required
                      className="w-full bg-slate-900/60 border border-slate-700/50 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">Work Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)}
                      placeholder="rahul@sharma-enterprises.com" required
                      className="w-full bg-slate-900/60 border border-slate-700/50 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type={showPass ? "text" : "password"} value={form.password}
                      onChange={(e) => update("password", e.target.value)}
                      placeholder="Min. 8 characters" required
                      className="w-full bg-slate-900/60 border border-slate-700/50 rounded-lg pl-9 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors" />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="password" value={form.confirmPassword}
                      onChange={(e) => update("confirmPassword", e.target.value)}
                      placeholder="Re-enter password" required
                      className="w-full bg-slate-900/60 border border-slate-700/50 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors" />
                  </div>
                </div>

                <button type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-lg transition-all text-sm flex items-center justify-center gap-2">
                  Continue to Plan Selection <ChevronRight className="w-4 h-4" />
                </button>
              </form>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <h2 className="text-lg font-semibold text-white mb-2">Choose your plan</h2>
              <div className="flex items-center gap-2 mb-5 px-3 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                <span className="text-lg">🎉</span>
                <p className="text-sm text-emerald-300 font-medium">No payment needed — all plans include a full 14-day free trial. Pick your plan and get instant access.</p>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-3 mb-6">
                {plans.map((plan) => (
                  <button key={plan.id} onClick={() => setSelectedPlan(plan.id)}
                    className={`w-full text-left rounded-xl border-2 p-4 transition-all ${
                      selectedPlan === plan.id
                        ? `${plan.color} bg-blue-600/10`
                        : "border-slate-700/50 bg-slate-900/40 hover:border-slate-600"
                    }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedPlan === plan.id ? "border-blue-400" : "border-slate-600"}`}>
                          {selectedPlan === plan.id && <div className="w-2 h-2 rounded-full bg-blue-400" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-white">{plan.name}</span>
                            {plan.popular && (
                              <span className="text-xs bg-blue-600/30 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full">Most Popular</span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">{plan.employees}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-white">{plan.price}</div>
                        <div className="text-xs text-emerald-400">14 days free</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 mb-6">
                <div className="flex items-start gap-2 text-xs text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>All plans include: CERT-In compliance, threat monitoring, incident response, log vault, vulnerability scanner, and security training. All data stored in India 🇮🇳</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => { setStep(1); setError(""); }}
                  className="flex-1 border border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 font-medium py-2.5 rounded-lg transition-all text-sm">
                  Back
                </button>
                <button onClick={handleSignup} disabled={loading}
                  className="flex-[2] bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-all text-sm">
                  {loading ? "Creating account..." : "Start 14-Day Free Trial — No Card Needed →"}
                </button>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">Sign in</Link>
        </p>

        <div className="text-center mt-4 text-xs text-slate-600">
          <span>CERT-In Compliant · DPDP Act 2023 · </span>
          <span className="text-blue-600">Data stored in India 🇮🇳</span>
        </div>
      </div>
    </div>
  );
}
