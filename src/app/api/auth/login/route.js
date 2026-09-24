import { NextResponse } from "next/server";

export async function POST(request) {
  const { email, password } = await request.json();


  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    return NextResponse.json({ message: "Admin API URL is not configured." }, { status: 500 });
  }

  try {
    const backendResponse = await fetch(`${apiUrl}/auth/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });
    const payload = await backendResponse.json().catch(() => null);

    if (!backendResponse.ok || !payload?.token) {
      return NextResponse.json(
        { message: payload?.message || "Unable to create an admin session." },
        { status: backendResponse.status || 502 },
      );
    }

    const response = NextResponse.json({ success: true, token: payload.token });
    response.cookies.set("milo_admin_session", "authenticated", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 43200,
    });
    return response;
  } catch {
    return NextResponse.json({ message: "Admin backend is unavailable." }, { status: 502 });
  }
}