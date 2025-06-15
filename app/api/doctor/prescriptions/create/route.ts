// app/api/doctor/prescriptions/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getUserFromSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = getUserFromSession(req);
  if (!session || session.role !== "DOCTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { patientId, content } = await req.json();
  if (!patientId || !content) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const doctor = await prisma.doctor.findUnique({ where: { userId: session.id } });
  if (!doctor) return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
  const prescription = await prisma.prescription.create({
    data: {
      patientId,
      doctorId: doctor.id,
      content,
    },
  });
  return NextResponse.json({ prescription });
}
