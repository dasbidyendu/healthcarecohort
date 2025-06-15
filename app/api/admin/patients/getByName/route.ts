import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import { getUserFromSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromSession(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { hospitalId } = user;

    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");

    if (!name) {
      return NextResponse.json({ error: "Missing 'name' query parameter" }, { status: 400 });
    }

    // You can change `findFirst` to `findMany` if you want to support multiple matches
    const patient = await prisma.patient.findFirst({
      where: {
        hospitalId,
        name: {
          contains: name,
          mode: "insensitive", // makes the name search case-insensitive
        },
      },
      select: {
        id: true,
        name: true,
        age: true,
        gender: true,
        phone: true,
        createdAt: true,
      },
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json(patient);
  } catch (err) {
    console.error("Error fetching patient by name:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
