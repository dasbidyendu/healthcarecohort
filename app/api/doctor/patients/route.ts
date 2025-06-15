// app/api/doctor/patients/route.ts
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
    include: { appointments: { include: { patient: true } } },
  });
  if (!doctor) return NextResponse.json({ patients: [] });
  const patients = doctor.appointments.map((appt) => appt.patient);
  return NextResponse.json({ patients });
}
