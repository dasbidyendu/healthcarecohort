import {
  GoogleGenerativeAI,
  GenerativeModel,
  Part,
  FunctionDeclaration,
  Schema,
} from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import { getUserFromSession } from "@/lib/auth";

type PrescriptionData = {
  analysis: string;
  prescription: {
    patient: {
      name: string;
      age: string;
      gender: string;
    };
    diagnosis: string;
    medicines: {
      name: string;
      dosage: string;
      frequency: string;
    }[];
    instructions: string[];
    followUp: string;
  };
};


// Gemini response schema
const responseSchema = {
  type: "object",
  properties: {
    analysis: { type: "string" } as Schema,
    prescription: {
      type: "object",
      properties: {
        patient: {
          type: "object",
          properties: {
            name: { type: "string" } as Schema,
            age: { type: "string" } as Schema,
            gender: { type: "string" } as Schema,
          },
          required: ["name", "age", "gender"],
        } as Schema,
        diagnosis: { type: "string" } as Schema,
        medicines: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" } as Schema,
              dosage: { type: "string" } as Schema,
              frequency: { type: "string" } as Schema,
            },
            required: ["name", "dosage", "frequency"],
          } as Schema,
        } as Schema,
        instructions: {
          type: "array",
          items: { type: "string" } as Schema,
        } as Schema,
        followUp: { type: "string" } as Schema,
      },
      required: ["patient", "diagnosis", "medicines", "instructions", "followUp"],
    } as Schema,
  },
  required: ["analysis", "prescription"],
} as Schema;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromSession(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { symptoms, patientId } = await req.json();
    console.log("Received request to generate prescription:", { symptoms, patientId });
    if (!symptoms || !patientId) {
      return NextResponse.json(
        { error: "Both 'symptoms' and 'patientName' are required." },
        { status: 400 }
      );
    }

    // Step 1: Find real patient from database (by name and hospital)
    const patient = await prisma.patient.findFirst({
      where: {
        hospitalId: user.hospitalId,
        id: patientId, // Assuming patientName is actually the patient ID
      },
      select: {
        name: true,
        age: true,
        gender: true,
      },
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found." }, { status: 404 });
    }

    // Step 2: Generate Gemini prescription
    const model: GenerativeModel = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
You are a professional medical assistant. A patient presents the following symptoms: "${symptoms}".

Your task is to call the function **generateMedicalReport** and provide:
- A brief medical **analysis** of the symptoms.
- A structured **prescription** that includes:
  - Fictional patient details (we will override them).
  - A medical **diagnosis**.
  - A list of **medicines** with their dosage and frequency.
  - Clear **instructions** for the patient.
  - A recommended **follow-up** plan.

Only return a function call to **generateMedicalReport** with no natural language text.
`,
            },
          ],
        },
      ],
      tools: [
        {
          functionDeclarations: [
            {
              name: "generateMedicalReport",
              description: "Generates a medical analysis and prescription.",
              parameters: responseSchema,
            } as FunctionDeclaration,
          ],
        },
      ],
    });

    const call = result.response.functionCall();

    if (!call || call.name !== "generateMedicalReport") {
      console.error("Model did not return expected function call.");
      return NextResponse.json(
        { error: "Model output was not structured correctly." },
        { status: 500 }
      );
    }

    const parsed = call.args as PrescriptionData;


    // Step 3: Override Gemini patient with real patient details
    parsed.prescription.patient = {
      name: patient.name,
      age: String(patient.age),
      gender: patient.gender,
    };

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error("Gemini error:", err);
    return NextResponse.json(
      { error: "Failed to generate prescription", details: err?.message },
      { status: 500 }
    );
  }
}
