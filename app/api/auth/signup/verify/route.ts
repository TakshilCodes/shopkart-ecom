import prisma from "@/lib/prisma";
import { redis } from "@/lib/redis";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

type UserData = {
    email: string,
    displayName: string,
    passwordHash: string,
    otpHash: string
}

export async function POST(req: NextRequest) {
    try {
        const { pendingEmail, otp } = await req.json()

        const user = await redis.get(`otp:pending:${pendingEmail}`) as UserData;

        if (!user) {
            return NextResponse.json({
                ok: false,
                msg: null,
                error: "Otp Expired!"
            }, { status: 404 })
        }


        const userotp = user?.otpHash
        const isValid = await bcrypt.compare(String(otp), userotp)

        if (isValid) {

            await prisma.users.create({
                data: {
                    DisplayName: user.displayName!,
                    email: user.email!,
                    Hashpassword: user.passwordHash,
                    role: 'User'
                }
            })

            await redis.del(`otp:pending:${pendingEmail}`);

            return NextResponse.json({
                ok: true,
                msg: "Done",
                error: null
            }, { status: 200 })
        } else {
            return NextResponse.json({
                ok: false,
                msg: null,
                error: "Otp Invalid"
            }, { status: 400 })
        }

    } catch (e: any) {
        return NextResponse.json(
            {
                ok: false,
                msg: null,
                error: "Something went wrong!"
            },
            {
                status: 500
            }
        );
    }
}