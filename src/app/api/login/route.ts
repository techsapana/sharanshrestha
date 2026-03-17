import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    console.log(process.env.ADMIN_USERNAME);

    if (username !== process.env.ADMIN_USERNAME) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    console.log(
      password,
      process.env.ADMIN_PASSWORD_HASH,
      process.env.ADMIN_PASSWORD,
    );

    const validPassword = password === process.env.ADMIN_PASSWORD;

    // const validPassword = await bcrypt.compare(
    //   password,
    //   process.env.ADMIN_PASSWORD_HASH!,
    // );

    console.log("PASSWORD MATCH:", validPassword);

    if (!validPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    const cookieStore = await cookies();

    cookieStore.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 86400,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
