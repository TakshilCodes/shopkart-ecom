import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

function bufferToDataUri(buffer: Buffer, mime: string) {
  return `data:${mime};base64,${buffer.toString("base64")}`;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "Image file is required" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { ok: false, error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    const maxSizeInBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      return NextResponse.json(
        { ok: false, error: "Image must be 5MB or smaller" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileUri = bufferToDataUri(buffer, file.type);

    const result = await cloudinary.uploader.upload(fileUri, {
      folder: "shopkart-ecom/products",
      resource_type: "image",
    });

    return NextResponse.json(
      {
        ok: true,
        msg: "Image uploaded successfully",
        imageUrl: result.secure_url,
        publicId: result.public_id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("UPLOAD IMAGE ERROR:", error);

    return NextResponse.json(
      { ok: false, error: "Failed to upload image" },
      { status: 500 }
    );
  }
}