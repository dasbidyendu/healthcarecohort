// /app/api/dashboard/stats/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyTokenFromCookies } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const hospitalId = verifyTokenFromCookies(req);
  if (!hospitalId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [doctors, patients, appointments] = await Promise.all([
    prisma.doctor.count({ where: { hospitalId } }),
    prisma.patient.count({ where: { hospitalId } }),
    prisma.appointment.count({ where: { hospitalId } }),
  ]);

  return NextResponse.json({ doctors, patients, appointments });
}
