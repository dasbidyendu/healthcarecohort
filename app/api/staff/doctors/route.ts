// /app/api/staff/doctors/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyTokenFromCookies, verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token = verifyTokenFromCookies(req);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = verifyToken(token);
  if (!session || session.role !== "STAFF") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const doctors = await prisma.doctor.findMany({
      where: {
        hospitalId: session.hospitalId,
      },
      select: {
          id: true,
            user:{
            name: true,
          },
        specialization: true,
      },
    });
    console.log("Fetched doctors:", doctors);
    return NextResponse.json({ success: true, doctors });
  } catch (err) {
    console.error("Error fetching doctors:", err);
    return NextResponse.json(
      { error: "Failed to fetch doctors" },
      { status: 500 }
    );
  }
}
