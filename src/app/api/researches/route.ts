import prisma from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const articles = await prisma.researchArticle.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(articles);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const article = await prisma.researchArticle.create({
      data: {
        title: data.title,
        journal: data.journal || null,
        year: data.year || null,
        doi: data.doi || null,
        tags: data.tags || [],
      },
    });
    return NextResponse.json(article);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 },
    );
  }
}
