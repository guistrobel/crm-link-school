import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateKRAtingimento } from "@/services/okr-calculator";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  // Update OKR
  if (body.objetivo !== undefined || body.peso !== undefined) {
    await prisma.oKR.update({
      where: { id },
      data: {
        objetivo: body.objetivo,
        peso: body.peso,
      },
    });
  }

  // Upsert key results
  if (body.keyResults && Array.isArray(body.keyResults)) {
    for (const kr of body.keyResults) {
      const atingimento = calculateKRAtingimento(kr);
      if (kr.id) {
        await prisma.keyResult.update({
          where: { id: kr.id },
          data: {
            descricao: kr.descricao,
            meta: kr.meta,
            peso: kr.peso,
            resultadoM1: kr.resultadoM1 != null ? Number(kr.resultadoM1) : null,
            resultadoM2: kr.resultadoM2 != null ? Number(kr.resultadoM2) : null,
            resultadoM3: kr.resultadoM3 != null ? Number(kr.resultadoM3) : null,
            atingimentoPerc: atingimento,
          },
        });
      } else {
        await prisma.keyResult.create({
          data: {
            okrId: id,
            descricao: kr.descricao,
            meta: kr.meta,
            peso: kr.peso,
            resultadoM1: kr.resultadoM1 != null ? Number(kr.resultadoM1) : null,
            resultadoM2: kr.resultadoM2 != null ? Number(kr.resultadoM2) : null,
            resultadoM3: kr.resultadoM3 != null ? Number(kr.resultadoM3) : null,
            atingimentoPerc: atingimento,
          },
        });
      }
    }
  }

  const updated = await prisma.oKR.findUnique({
    where: { id },
    include: { keyResults: true },
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.oKR.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
