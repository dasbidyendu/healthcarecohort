import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = getUserFromSession(req);

    if (!session || session.role !== "STAFF") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, age, gender, phone } = await req.json();

    if (!name || !age || !gender || !phone) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const patient = await prisma.patient.create({
      data: {
        name,
        age: parseInt(age),
        gender,
        phone,
        hospitalId: session.hospitalId,
        createdById: session.id,
      },
    });

    return NextResponse.json({ success: true, patient });
  } catch (error) {
    console.error("[REGISTER_PATIENT_ERROR]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
