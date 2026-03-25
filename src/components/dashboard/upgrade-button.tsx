"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Zap } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PLAN_LABELS: Record<string, string> = {
  KAVACH: "Kavach Basic",
  SURAKSHA: "Suraksha Pro",
  RAKSHAK: "Rakshak Enterprise",
};

export function UpgradeButton({ plan = "SURAKSHA" }: { plan?: string }) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    setLoading(true);
    try {
      // Create Razorpay order
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Load Razorpay script dynamically
      if (!window.Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load Razorpay"));
          document.head.appendChild(script);
        });
      }

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "CyberShield India",
        description: `${PLAN_LABELS[plan] ?? plan} Subscription`,
        image: "/logo.png",
        order_id: data.orderId,
        handler: async function (response: any) {
          // Verify payment on server
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          if (verifyRes.ok) {
            window.location.reload(); // Reload to show updated plan
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: session?.user?.name ?? "",
          email: session?.user?.email ?? "",
        },
        theme: { color: "#2563EB" },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Could not initiate payment. Please try again.");
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleUpgrade}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold transition-all"
    >
      <Zap className="w-3.5 h-3.5" />
      {loading ? "Processing..." : "Upgrade Plan"}
    </button>
  );
}
