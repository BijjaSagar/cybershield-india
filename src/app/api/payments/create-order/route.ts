import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const PLAN_AMOUNTS: Record<string, number> = {
  KAVACH: 99900,    // ₹999 in paise
  SURAKSHA: 249900, // ₹2499
  RAKSHAK: 399900,  // ₹3999
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = await req.json();
    const orgId = (session.user as any).orgId;
    if (!orgId) {
      return NextResponse.json({ error: "No organization found." }, { status: 400 });
    }

    const amount = PLAN_AMOUNTS[plan];
    if (!amount) {
      return NextResponse.json({ error: "Invalid plan." }, { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `cs_${orgId.slice(0, 8)}_${Date.now()}`,
      notes: { plan, orgId },
    });

    // Save pending payment to DB
    await prisma.payment.create({
      data: {
        orgId,
        razorpayOrderId: order.id,
        amount,
        currency: "INR",
        plan: plan as "KAVACH" | "SURAKSHA" | "RAKSHAK",
        status: "PENDING",
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount,
      currency: "INR",
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("[create-order]", err);
    return NextResponse.json({ error: "Failed to create order." }, { status: 500 });
  }
}
