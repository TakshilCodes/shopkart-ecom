import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { redis } from "@/lib/redis";
import { z } from "zod";

const VerifyPasswordOtpZod = z.object({
  mode: z.enum(["change", "forgot"]),
  email: z.string().trim().email("Please enter a valid email"),
  otp: z.string().trim().length(6, "OTP must be 6 digits"),
});

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

    const parsed = VerifyPasswordOtpZod.safeParse(body);

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

    const { mode, otp } = parsed.data;
    const email = parsed.data.email.toLowerCase().trim();

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
    }

    const redisValue = await redis.get(`password-otp:${mode}:${email}`);

    if (!redisValue) {
      return NextResponse.json(
        {
          ok: false,
          msg: null,
          error: "OTP expired or invalid request",
        },
        { status: 400 }
      );
    }

    const parsedRedis =
      typeof redisValue === "string" ? JSON.parse(redisValue) : redisValue;

    const { userId, email: storedEmail, otpHash, newPasswordHash, mode: storedMode } =
      parsedRedis;

    if (storedEmail !== email || storedMode !== mode) {
      return NextResponse.json(
        {
          ok: false,
          msg: null,
          error: "Invalid verification request",
        },
        { status: 400 }
      );
    }

    if (mode === "change") {
      const session = await getServerSession(authOptions);

      if (!session?.user?.id || session.user.id !== userId) {
        return NextResponse.json(
          {
            ok: false,
            msg: null,
            error: "Unauthorized verification request",
          },
          { status: 403 }
        );
      }
    }

    const isOtpValid = await bcrypt.compare(otp, otpHash);

    if (!isOtpValid) {
      return NextResponse.json(
        {
          ok: false,
          msg: null,
          error: "Invalid OTP",
        },
        { status: 400 }
      );
    }

    await prisma.users.update({
      where: { id: userId },
      data: {
        Hashpassword: newPasswordHash,
      },
    });

    await redis.del(`password-otp:${mode}:${email}`);

    return NextResponse.json(
      {
        ok: true,
        msg: "Password updated successfully",
        error: null,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        msg: null,
        error: "OTP verification failed",
      },
      { status: 500 }
    );
  }
}