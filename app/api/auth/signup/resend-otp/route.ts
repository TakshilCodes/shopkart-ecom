import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { randomInt } from "crypto";
import bcrypt from "bcryptjs";
import emailjs from "@emailjs/nodejs";

async function canSendOtp(email: string) {
  const key = `ratelimit:otp:${email}`;

  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, 10 * 60);
  }

  return count <= 3;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body?.email || "").toLowerCase().trim();

    if (!email) {
      return NextResponse.json(
        {
          ok: false,
          msg: null,
          error: "Email is required",
        },
        { status: 400 }
      );
    }

    const pendingUser = await redis.get(`otp:pending:${email}`);

    if (!pendingUser) {
      return NextResponse.json(
        {
          ok: false,
          msg: null,
          error: "OTP expired. Please sign up again.",
        },
        { status: 400 }
      );
    }

    const parsedPendingUser =
      typeof pendingUser === "string" ? JSON.parse(pendingUser) : pendingUser;

    const { displayName, hashPassword } = parsedPendingUser;

    const canSend = await canSendOtp(email);

    if (!canSend) {
      return NextResponse.json(
        {
          ok: false,
          msg: null,
          error: "Too many OTP requests. Try again later.",
        },
        { status: 429 }
      );
    }

    const otp = randomInt(100000, 1000000);
    const otpHash = await bcrypt.hash(String(otp), 12);

    const emailjs_serviceId = process.env.Emailjs_ServiceId;
    const emailjs_templateId = process.env.Emailjs_TemplateId;
    const emailjs_publickey = process.env.Emailjs_PublicId;
    const emailjs_privatekey = process.env.Emailjs_PrivateId;

    if (
      !emailjs_serviceId ||
      !emailjs_templateId ||
      !emailjs_publickey ||
      !emailjs_privatekey
    ) {
      return NextResponse.json(
        {
          ok: false,
          msg: null,
          error: "Email config missing",
        },
        { status: 500 }
      );
    }

    const templateParams = {
      otp,
      email,
      name: displayName,
    };

    const emailRes = await emailjs.send(
      emailjs_serviceId,
      emailjs_templateId,
      templateParams,
      {
        publicKey: emailjs_publickey,
        privateKey: emailjs_privatekey,
      }
    );

    if (!emailRes.status) {
      return NextResponse.json(
        {
          ok: false,
          msg: null,
          error: "Failed to resend OTP",
        },
        { status: 500 }
      );
    }

    const updatedData = {
      email,
      displayName,
      hashPassword,
      otpHash,
    };

    await redis.set(`otp:pending:${email}`, JSON.stringify(updatedData), {
      ex: 10 * 60,
    });

    return NextResponse.json(
      {
        ok: true,
        msg: "OTP resent successfully",
        error: null,
      },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      {
        ok: false,
        msg: null,
        error: "Failed to resend OTP",
      },
      { status: 500 }
    );
  }
}