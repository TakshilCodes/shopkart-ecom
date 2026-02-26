import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomInt } from "crypto";
import emailjs from '@emailjs/nodejs';
import { SignupZod } from "@/lib/validators/auth";
import { redis } from "@/lib/redis";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const result = SignupZod.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                {
                    ok: false,
                    msg: null,
                    error: result.error.flatten(),
                    email: null
                },
                { status: 400 }
            );
        }

        const { displayName,password } = result.data;
        const email = result.data.email.toLowerCase().trim();

        const emailTaken = await prisma.users.findUnique({
            where: { email: email },
            select: { id: true },
        });

        if (emailTaken) {
            return NextResponse.json(
                {
                    ok: false,
                    msg: null,
                    error: "Email already exists",
                    email: null
                }, { status: 409 }
            );
        }

        const hashedpassword = await bcrypt.hash(password, 12)

        const otp = randomInt(100000, 1000000);
        const otpHash = await bcrypt.hash(String(otp), 12)

        const emailjs_serviceId = process.env.Emailjs_ServiceId
        const emailjs_templateId = process.env.Emailjs_TemplateId
        const emailjs_publickey = process.env.Emailjs_PublicId
        const emailjs_privatekey = process.env.Emailjs_PrivateId

        if (!emailjs_serviceId || !emailjs_templateId || !emailjs_publickey || !emailjs_privatekey) {
            return NextResponse.json({
                ok: false,
                msg: null,
                error: "Email config missing",
                email: null
            }, { status: 500 });
        }

        async function canSendOtp(email: string) {
            const key = `ratelimit:otp:${email}`;

            const count = await redis.incr(key);

            if (count === 1) {
                await redis.expire(key, 10 * 60);
            }
            return count <= 3;
        }

        const canSend = await canSendOtp(email);

        if (!canSend) {
            return NextResponse.json(
                {
                    ok: false,
                    msg: null,
                    error: "Too many OTP requests. Try again later.",
                    email: null
                },
                { status: 429 }
            );
        }

        const templateParams = {
            otp: otp,
            email: email,
            name: displayName
        }

        const res = await emailjs.send(emailjs_serviceId, emailjs_templateId, templateParams, {
            publicKey: emailjs_publickey,
            privateKey: emailjs_privatekey,
        });

        if(!res.status){
            return NextResponse.json(
            {
                ok: false,
                msg: null,
                error: "Failed to send OTP",
                email: null
            },
            { status: 500 }
        );
        }

        const data = {
            email: email,
            displayName: displayName,
            hashPassword: hashedpassword,
            otpHash: otpHash
        }

        await redis.set(`otp:pending:${email}`, JSON.stringify(data), { ex: 10 * 60 });

        return NextResponse.json({
            ok: true,
            msg: "OTP sent!",
            error: null,
            email: email
        },
            { status: 200 });

    } catch (e: any) {
        return NextResponse.json(
            {
                ok: false,
                msg: null,
                error: "Signup init failed",
                email: null
            },
            { status: 500 }
        );
    }
}