// /app/api/staff/patients/route.ts
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
    const patients = await prisma.patient.findMany({
      where: {
        hospitalId: session.hospitalId,
      },
      select: {
        id: true,
        name: true,
        age: true,
        gender: true,
        phone: true,
        createdAt: true,
        createdBy: {
          select: {
            name: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, patients });
  } catch (err) {
    console.error("Error fetching patients:", err);
    return NextResponse.json(
      { error: "Failed to fetch patients" },
      { status: 500 }
    );
  }
}
