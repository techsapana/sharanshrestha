import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const resources = await prisma.resource.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(resources);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const resource = await prisma.resource.create({
      data: {
        title: body.title,
        description: body.description,
        fileUrl: body.fileUrl,
      },
    });

    return NextResponse.json(resource);
  } catch (err) {
    console.error("Error in resources api: ", err);
    return NextResponse.json(
      { error: "Failed to create resource" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const updated = await prisma.resource.update({
      where: { id: body.id },
      data: {
        title: body.title,
        description: body.description,
        fileUrl: body.fileUrl,
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));

  await prisma.resource.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
