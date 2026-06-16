import prisma from "@/lib/prisma";
import cloudinary from "@/services/cloudinary";
import type { UploadApiResponse } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

 const MAX_IMAGE_SIZE_BYTES = 50 * 1024 * 1024;

const uploadToCloudinary = (buffer: Buffer): Promise<UploadApiResponse> =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "blogs" },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        if (!result) {
          reject(new Error("Cloudinary upload failed"));
          return;
        }
        resolve(result);
      },
    );
    stream.end(buffer);
  });

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

    if (imageFile) {
      if (imageFile.size > MAX_IMAGE_SIZE_BYTES) {
        return NextResponse.json(
          { error: "Image exceeds 50MB limit" },
          { status: 413 },
        );
      }
      const buffer = Buffer.from(await imageFile.arrayBuffer());

      const uploadResult = await uploadToCloudinary(buffer);

      imageUrl = uploadResult.secure_url;
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
      const buffer = Buffer.from(await imageFile.arrayBuffer());

      const { secure_url } = await uploadToCloudinary(buffer);

      imageUrl = secure_url;
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
