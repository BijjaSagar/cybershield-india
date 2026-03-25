import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = await req.json();

    // Verify Razorpay signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSig = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSig !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature." }, { status: 400 });
    }

    // Update payment record
    const payment = await prisma.payment.update({
      where: { razorpayOrderId: razorpay_order_id },
      data: {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "CAPTURED",
      },
    });

    // Activate subscription — set to ACTIVE, set billing period to 30 days
    await prisma.organization.update({
      where: { id: payment.orgId },
      data: {
        subscriptionStatus: "ACTIVE",
        plan: payment.plan,
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[verify-payment]", err);
    return NextResponse.json({ error: "Payment verification failed." }, { status: 500 });
  }
}
