// app/api/doctor/appointments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getUserFromSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = getUserFromSession(req);
  if (!session || session.role !== "DOCTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const doctor = await prisma.doctor.findUnique({
    where: { userId: session.id },
  });
  if (!doctor) return NextResponse.json({ appointments: [] });

  const appts = await prisma.appointment.findMany({
    where: { doctorId: doctor.id },
    include: { patient: true },
    orderBy: { date: "desc" },
  });
  return NextResponse.json({ appointments: appts });
}
