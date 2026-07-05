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

export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(blogs);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const blogData = JSON.parse(formData.get("blog") as string);
    const imageFile = formData.get("image") as File | null;

    let imageUrl: string | undefined;

    if (imageFile && imageFile instanceof File) {
      if (imageFile.size > MAX_IMAGE_SIZE_BYTES) {
        return NextResponse.json(
          { error: "Image exceeds 50MB limit" },
          { status: 413 },
        );
      }
      imageUrl = await saveFileToDisk(imageFile);
    }

    const blog = await prisma.blog.create({
      data: {
        title: blogData.title,
        content: blogData.content,
        image: imageUrl || "",
      },
    });

    return NextResponse.json(blog);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const formData = await req.formData();
    const blogData = JSON.parse(formData.get("blog") as string);
    const imageFile = formData.get("image") as File | null;

    let imageUrl = blogData.image || "";

    if (imageFile && imageFile instanceof File) {
      if (imageFile.size > MAX_IMAGE_SIZE_BYTES) {
        return NextResponse.json(
          { error: "Image exceeds 50MB limit" },
          { status: 413 },
        );
      }
      imageUrl = await saveFileToDisk(imageFile);
    }

    const updatedBlog = await prisma.blog.update({
      where: { id: Number(blogData.id) },
      data: {
        title: blogData.title,
        content: blogData.content,
        image: imageUrl,
      },
    });

    return NextResponse.json(updatedBlog);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update blog" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");

    if (!idParam) {
      return NextResponse.json(
        { error: "Blog ID is required" },
        { status: 400 },
      );
    }

    const id = Number(idParam);

    const existingBlog = await prisma.blog.findUnique({ where: { id } });
    if (!existingBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    await prisma.blog.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 },
    );
  }
}
