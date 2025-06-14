import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = getUserFromSession(req);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const hospitalId = session.hospitalId;

  try {
    const [doctors, patients, appointments] = await Promise.all([
      prisma.doctor.count({ where: { hospitalId } }),
      prisma.patient.count({ where: { hospitalId } }),
      prisma.appointment.count({ where: { hospitalId } }),
    ]);

    console.log(
      `[DASHBOARD_STATS] Doctors: ${doctors}, Patients: ${patients}, Appointments: ${appointments}`
    );

    return NextResponse.json({ doctors, patients, appointments });
  } catch (error) {
    console.error("[DASHBOARD_STATS_ERROR]", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
