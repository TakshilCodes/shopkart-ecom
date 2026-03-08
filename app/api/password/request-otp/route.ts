import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomInt } from "crypto";
import emailjs from "@emailjs/nodejs";
import { redis } from "@/lib/redis";
import { z } from "zod";

const RequestPasswordOtpZod = z.object({
  mode: z.enum(["change", "forgot"]),
  email: z.string().trim().email("Please enter a valid email").optional(),
  currentPassword: z.string().min(1, "Current password is required").optional(),
  newPassword: z
    .string()
    .min(6, "New password must be at least 6 characters")
    .max(100, "New password is too long"),
});

async function canSendOtp(email: string) {
  const key = `ratelimit:password-otp:${email}`;
  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, 10 * 60);
  }

  return count <= 3;
}

function getFirstZodError(error: z.ZodError) {
  const fieldErrors = error.flatten().fieldErrors;

  return (
    Object.values(fieldErrors).find(
      (value): value is string[] => Array.isArray(value) && value.length > 0
    )?.[0] || "Invalid input"
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = RequestPasswordOtpZod.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          msg: null,
          error: getFirstZodError(parsed.error),
        },
        { status: 400 }
      );
    }

    const { mode, newPassword } = parsed.data;
    const normalizedEmail = parsed.data.email?.toLowerCase().trim();

    let userId = "";
    let userEmail = "";
    let displayName = "User";

    if (mode === "change") {
      const session = await getServerSession(authOptions);

      if (!session?.user?.id) {
        return NextResponse.json(
          {
            ok: false,
            msg: null,
            error: "Unauthorized",
          },
          { status: 401 }
        );
      }

      const user = await prisma.users.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          email: true,
          DisplayName: true,
          Hashpassword: true,
        },
      });

      if (!user) {
        return NextResponse.json(
          {
            ok: false,
            msg: null,
            error: "User not found",
          },
          { status: 404 }
        );
      }

      if (!user.Hashpassword) {
        return NextResponse.json(
          {
            ok: false,
            msg: null,
            error: "Password login is not enabled for this account",
          },
          { status: 400 }
        );
      }

      const currentPassword = parsed.data.currentPassword;

      if (!currentPassword) {
        return NextResponse.json(
          {
            ok: false,
            msg: null,
            error: "Current password is required",
          },
          { status: 400 }
        );
      }

      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        user.Hashpassword
      );

      if (!isCurrentPasswordValid) {
        return NextResponse.json(
          {
            ok: false,
            msg: null,
            error: "Current password is incorrect",
          },
          { status: 400 }
        );
      }

      const isSamePassword = await bcrypt.compare(newPassword, user.Hashpassword);

      if (isSamePassword) {
        return NextResponse.json(
          {
            ok: false,
            msg: null,
            error: "New password must be different from current password",
          },
          { status: 400 }
        );
      }

      userId = user.id;
      userEmail = user.email.toLowerCase().trim();
      displayName = user.DisplayName || "User";
    }

    if (mode === "forgot") {
      if (!normalizedEmail) {
        return NextResponse.json(
          {
            ok: false,
            msg: null,
            error: "Email is required",
          },
          { status: 400 }
        );
      }

      const user = await prisma.users.findUnique({
        where: { email: normalizedEmail },
        select: {
          id: true,
          email: true,
          DisplayName: true,
          Hashpassword: true,
        },
      });

      // Optional security choice:
      // You can return generic success here to avoid user enumeration.
      if (!user) {
        return NextResponse.json(
          {
            ok: true,
            msg: "If an account exists for this email, an OTP has been sent.",
            error: null,
          },
          { status: 200 }
        );
      }

      userId = user.id;
      userEmail = user.email.toLowerCase().trim();
      displayName = user.DisplayName || "User";
    }

    const canSend = await canSendOtp(userEmail);

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
    const newPasswordHash = await bcrypt.hash(newPassword, 12);

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
      email: userEmail,
      name: displayName,
      purpose:
        mode === "change" ? "Change Password Verification" : "Reset Password Verification",
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
          error: "Failed to send OTP",
        },
        { status: 500 }
      );
    }

    const redisPayload = {
      userId,
      email: userEmail,
      otpHash,
      newPasswordHash,
      mode,
    };

    await redis.set(
      `password-otp:${mode}:${userEmail}`,
      JSON.stringify(redisPayload),
      { ex: 10 * 60 }
    );

    return NextResponse.json(
      {
        ok: true,
        msg: "OTP sent successfully",
        error: null,
        email: userEmail,
        mode,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        msg: null,
        error: "Failed to initiate password change",
      },
      { status: 500 }
    );
  }
}