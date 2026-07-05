import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

const MAX_IMAGE_SIZE_BYTES = 50 * 1024 * 1024;
const UPLOAD_DIR = "/var/www/sharanshrestha_media";

// Utility function to securely save uploaded File to the local disk
const saveFileToDisk = async (file: File): Promise<string> => {
  const buffer = Buffer.from(await file.arrayBuffer());
  const extension = file.name.split(".").pop() || "png";
  
  // Generate a unique, sanitized filename to prevent path traversal & overwrites
  const filename = `${crypto.randomUUID()}-${Date.now()}.${extension}`;
  const filepath = path.join(UPLOAD_DIR, filename);

  await writeFile(filepath, buffer);
  
  // Return the relative URL string mapped via Nginx
  return `/uploads/${filename}`;
};

/* =========================
   GET ALL GALLERIES
========================= */
export async function GET() {
  try {
    const galleries = await prisma.gallery.findMany({
      include: { images: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(galleries);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch galleries" },
      { status: 500 },
    );
  }
}

/* =========================
   CREATE GALLERY
========================= */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const galleryData = JSON.parse(formData.get("gallery") as string);

    const files = formData.getAll("images") as File[];

    const imageUrls: string[] = [];

    for (const file of files) {
      if (file instanceof File) {
        if (file.size > MAX_IMAGE_SIZE_BYTES) {
          return NextResponse.json(
            { error: "Image exceeds 50MB limit" },
            { status: 413 },
          );
        }
        const uploadedUrl = await saveFileToDisk(file);
        imageUrls.push(uploadedUrl);
      }
    }

    const gallery = await prisma.gallery.create({
      data: {
        title: galleryData.title,
        images: {
          create: imageUrls.map((url) => ({ url })),
        },
      },
      include: { images: true },
    });

    return NextResponse.json(gallery);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create gallery" },
      { status: 500 },
    );
  }
}

/* =========================
   UPDATE GALLERY
========================= */
export async function PUT(req: NextRequest) {
  try {
    const formData = await req.formData();
    const galleryData = JSON.parse(formData.get("gallery") as string);

    const files = formData.getAll("images") as File[];

    const imageUrls: string[] = [];

    // Upload new images if any
    for (const file of files) {
      if (file instanceof File && file.size > 0) {
        if (file.size > MAX_IMAGE_SIZE_BYTES) {
          return NextResponse.json(
            { error: "Image exceeds 50MB limit" },
            { status: 413 },
          );
        }
        const uploadedUrl = await saveFileToDisk(file);
        imageUrls.push(uploadedUrl);
      }
    }

    const galleryId = Number(galleryData.id);

    // Update title
    await prisma.gallery.update({
      where: { id: galleryId },
      data: { title: galleryData.title },
    });

    // Add new images if uploaded
    if (imageUrls.length > 0) {
      await prisma.galleryImage.createMany({
        data: imageUrls.map((url) => ({
          url,
          galleryId,
        })),
      });
    }

    const updatedGallery = await prisma.gallery.findUnique({
      where: { id: galleryId },
      include: { images: true },
    });

    return NextResponse.json(updatedGallery);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update gallery" },
      { status: 500 },
    );
  }
}

/* =========================
   DELETE GALLERY
========================= */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");

    if (!idParam) {
      return NextResponse.json(
        { error: "Gallery ID required" },
        { status: 400 },
      );
    }

    const id = Number(idParam);

    await prisma.gallery.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Gallery deleted",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to delete gallery" },
      { status: 500 },
    );
  }
}
