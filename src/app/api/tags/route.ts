import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { alunoId, tag, action } = body;

  if (action === "remove") {
    await prisma.alunoTag.deleteMany({ where: { alunoId, tag } });
  } else {
    await prisma.alunoTag.upsert({
      where: { alunoId_tag: { alunoId, tag } },
      create: { alunoId, tag },
      update: {},
    });
  }

  return NextResponse.json({ success: true });
}
