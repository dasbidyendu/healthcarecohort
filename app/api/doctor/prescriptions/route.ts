// app/api/doctor/prescriptions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getUserFromSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = getUserFromSession(req);
  if (!session || session.role !== "DOCTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const doctor = await prisma.doctor.findUnique({ where: { userId: session.id } });
  if (!doctor) return NextResponse.json({ prescriptions: [] });

  const prescriptions = await prisma.prescription.findMany({
    where: { doctorId: doctor.id },
    include: { patient: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ prescriptions });
}
