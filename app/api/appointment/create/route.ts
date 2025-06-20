import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = getUserFromSession(req);

    if (!session || session.role !== "STAFF") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { doctorId, patientId, date, notes } = await req.json();

    if (!doctorId || !patientId || !date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const appointment = await prisma.appointment.create({
      data: {
        doctorId,
        patientId,
        date: new Date(date),
        notes,
        hospitalId: session.hospitalId,
      },
    });

    return NextResponse.json({ success: true, appointment });
  } catch (error) {
    console.error("[CREATE_APPOINTMENT_ERROR]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
