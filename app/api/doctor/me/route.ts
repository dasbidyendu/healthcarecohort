import { NextRequest, NextResponse } from "next/server";
import { getUserFromSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromSession(req);

    if (!user || user.role !== "DOCTOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log("GET /api/doctor/me user:", user);
    const doctor = await prisma.doctor.findUnique({
  where: { userId: user.id },
  select: {
    id: true,
    specialization: true,
    hospitalId: true,
    user: {
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    },
    hospital: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
    appointments: {
      select: {
        id: true,
        date: true,
        notes: true,
        patient: {
          select: {
            id: true,
            name: true,
            age: true,
            gender: true,
          },
        },
      },
    },
    prescriptions: {
      select: {
        id: true,
        content: true,
        createdAt: true,
        patient: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    },
  },
});

    console.log("GET /api/doctor/me response:", doctor);

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }
    return NextResponse.json(doctor);
  } catch (error) {
    console.error("GET /api/doctor/me error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
