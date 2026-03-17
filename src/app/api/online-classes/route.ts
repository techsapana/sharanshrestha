import prisma from "@/src/lib/prisma";
import { NextResponse } from "next/server";

function durationToMs(duration: string) {
  let minutes = 0;

  const hourMatch = duration.match(/(\d+)\s*h/);
  const minMatch = duration.match(/(\d+)\s*m/);

  if (hourMatch) minutes += parseInt(hourMatch[1]) * 60;
  if (minMatch) minutes += parseInt(minMatch[1]);

  return minutes * 60 * 1000;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const onlineClass = await prisma.onlineClass.create({
      data: {
        title: body.title,
        description: body.description,
        duration: body.duration,
        link: body.link,
      },
    });

    return NextResponse.json({ success: true, class: onlineClass });
  } catch (err) {
    console.error("Error creating online class:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET() {
  try {
    const latestClass = await prisma.onlineClass.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!latestClass) {
      return NextResponse.json({ exists: false });
    }

    const durationMs = durationToMs(latestClass.duration);
    const endTime = new Date(latestClass.createdAt).getTime() + durationMs;

    const now = Date.now();

    if (now <= endTime) {
      return NextResponse.json({
        exists: true,
        class: latestClass,
      });
    }

    return NextResponse.json({ exists: false });
  } catch (err) {
    console.error("Error fetching online class:", err);
    return NextResponse.json({ exists: false });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json(
        { success: false, message: "Class ID is required" },
        { status: 400 },
      );
    }

    const updatedClass = await prisma.onlineClass.update({
      where: { id: body.id },
      data: {
        title: body.title,
        description: body.description,
        duration: body.duration,
        link: body.link,
      },
    });

    return NextResponse.json({ success: true, class: updatedClass });
  } catch (err) {
    console.error("Error updating online class:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json(
        { success: false, message: "Class ID is required" },
        { status: 400 },
      );
    }

    await prisma.onlineClass.delete({
      where: { id: body.id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting online class:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
