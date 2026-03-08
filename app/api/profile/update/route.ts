import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { randomInt } from "crypto";
import bcrypt from "bcryptjs";
import emailjs from "@emailjs/nodejs";
import { redis } from "@/lib/redis";
import { z } from "zod";

const UpdateProfileZod = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name is too long"),
  email: z.string().trim().email("Please enter a valid email"),
});

async function canSendOtp(email: string) {
  const key = `ratelimit:profile-email-change:${email}`;
  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, 10 * 60);
  }

  return count <= 3;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          ok: false,
          error: "Unauthorized",
          msg: null,
          requiresOtp: false,
        },
        { status: 401 }
      );
    }

    const body = await req.json();

    const result = UpdateProfileZod.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          ok: false,
          error: result.error.flatten(),
          msg: null,
          requiresOtp: false,
        },
        { status: 400 }
      );
    }

    const displayName = result.data.displayName.trim();
    const newEmail = result.data.email.trim().toLowerCase();

    const currentUser = await prisma.users.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        DisplayName: true,
      },
    });

    if (!currentUser) {
      return NextResponse.json(
        {
          ok: false,
          error: "User not found",
          msg: null,
          requiresOtp: false,
        },
        { status: 404 }
      );
    }

    const oldEmail = currentUser.email.toLowerCase().trim();

    // Only display name changed
    if (newEmail === oldEmail) {
      await prisma.users.update({
        where: { id: currentUser.id },
        data: {
          DisplayName: displayName,
        },
      });

      return NextResponse.json(
        {
          ok: true,
          error: null,
          msg: "Profile updated successfully",
          requiresOtp: false,
        },
        { status: 200 }
      );
    }

    // Email changed -> check duplicate
    const emailTaken = await prisma.users.findUnique({
      where: { email: newEmail },
      select: { id: true },
    });

    if (emailTaken) {
      return NextResponse.json(
        {
          ok: false,
          error: "Email already exists",
          msg: null,
          requiresOtp: false,
        },
        { status: 409 }
      );
    }

    const canSend = await canSendOtp(newEmail);

    if (!canSend) {
      return NextResponse.json(
        {
          ok: false,
          error: "Too many OTP requests. Try again later.",
          msg: null,
          requiresOtp: false,
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
          error: "Email config missing",
          msg: null,
          requiresOtp: false,
        },
        { status: 500 }
      );
    }

    const templateParams = {
      otp,
      email: newEmail,
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
          error: "Failed to send OTP",
          msg: null,
          requiresOtp: false,
        },
        { status: 500 }
      );
    }

    const redisData = {
      userId: currentUser.id,
      displayName,
      pendingEmail: newEmail,
      otpHash,
    };

    await redis.set(
      `profile-email-change:${currentUser.id}`,
      JSON.stringify(redisData),
      { ex: 10 * 60 }
    );

    return NextResponse.json(
      {
        ok: true,
        error: null,
        msg: "OTP sent to your new email address",
        requiresOtp: true,
        email: newEmail,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: "Profile update failed",
        msg: null,
        requiresOtp: false,
      },
      { status: 500 }
    );
  }
}