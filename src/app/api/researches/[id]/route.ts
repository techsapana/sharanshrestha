import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const articleId = Number(id);

  if (!Number.isFinite(articleId)) {
    return NextResponse.json({ error: "Invalid article id" }, { status: 400 });
  }

  try {
    const data = await req.json();

    const updated = await prisma.researchArticle.update({
      where: { id: articleId },
      data: {
        title: data.title,
        journal: data.journal || null,
        year: data.year || null,
        doi: data.doi || null,
        tags: data.tags || [],
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update article" },
      { status: 500 },
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const articleId = Number(id);

  if (!Number.isFinite(articleId)) {
    return NextResponse.json({ error: "Invalid article id" }, { status: 400 });
  }

  try {
    await prisma.researchArticle.delete({
      where: { id: articleId },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to delete article" },
      { status: 500 },
    );
  }
}
