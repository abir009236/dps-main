import { NextResponse } from "next/server";

export async function GET(req) {
  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/cancel`
  );
}
