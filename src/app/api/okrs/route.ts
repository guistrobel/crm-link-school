import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateKRAtingimento } from "@/services/okr-calculator";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const alunoId = searchParams.get("alunoId") || "";
  const where: any = {};
  if (alunoId) where.alunoId = alunoId;
  const okrs = await prisma.oKR.findMany({
    where,
    include: { keyResults: true },
    orderBy: { tipo: "asc" },
  });
  return NextResponse.json(okrs);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const okr = await prisma.oKR.create({
    data: {
      alunoId: body.alunoId,
      tipo: body.tipo,
      objetivo: body.objetivo || "",
      peso: body.peso ?? 0.5,
    },
    include: { keyResults: true },
  });
  return NextResponse.json(okr, { status: 201 });
}
