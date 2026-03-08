import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { redis } from "@/lib/redis";
import { z } from "zod";

const VerifyOtpZod = z.object({
  otp: z.string().trim().length(6, "OTP must be 6 digits"),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          ok: false,
          error: "Unauthorized",
          msg: null,
        },
        { status: 401 }
      );
    }

    const body = await req.json();

    const result = VerifyOtpZod.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          ok: false,
          error: result.error.flatten(),
          msg: null,
        },
        { status: 400 }
      );
    }

    const { otp } = result.data;

    const redisValue = await redis.get(`profile-email-change:${session.user.id}`);

    if (!redisValue) {
      return NextResponse.json(
        {
          ok: false,
          error: "OTP expired or no pending email change found",
          msg: null,
        },
        { status: 400 }
      );
    }

    const parsed =
      typeof redisValue === "string" ? JSON.parse(redisValue) : redisValue;

    const { userId, displayName, pendingEmail, otpHash } = parsed;

    if (userId !== session.user.id) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid verification request",
          msg: null,
        },
        { status: 403 }
      );
    }

    const isOtpValid = await bcrypt.compare(otp, otpHash);

    if (!isOtpValid) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid OTP",
          msg: null,
        },
        { status: 400 }
      );
    }

    const emailTaken = await prisma.users.findFirst({
      where: {
        email: pendingEmail,
        NOT: {
          id: session.user.id,
        },
      },
      select: {
        id: true,
      },
    });

    if (emailTaken) {
      return NextResponse.json(
        {
          ok: false,
          error: "Email already exists",
          msg: null,
        },
        { status: 409 }
      );
    }

    await prisma.users.update({
      where: {
        id: session.user.id,
      },
      data: {
        DisplayName: displayName,
        email: pendingEmail,
      },
    });

    await redis.del(`profile-email-change:${session.user.id}`);

    return NextResponse.json(
      {
        ok: true,
        error: null,
        msg: "Email updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: "OTP verification failed",
        msg: null,
      },
      { status: 500 }
    );
  }
}