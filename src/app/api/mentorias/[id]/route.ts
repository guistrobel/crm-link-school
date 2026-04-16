import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const mentoria = await prisma.mentoria.findUnique({
    where: { id },
    include: {
      aluno: { select: { id: true, nome: true } },
      mentor: { select: { id: true, nome: true } },
    },
  });
  if (!mentoria) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(mentoria);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const mentoria = await prisma.mentoria.update({
    where: { id },
    data: {
      tipo: body.tipo,
      dataAgendada: body.dataAgendada ? new Date(body.dataAgendada) : undefined,
      dataRealizada: body.dataRealizada ? new Date(body.dataRealizada) : null,
      status: body.status,
      notaMentor: body.notaMentor != null ? Number(body.notaMentor) : null,
      feedbackQualitativo: body.feedbackQualitativo || null,
      entregaveisRecebidos: body.entregaveisRecebidos ?? false,
    },
    include: {
      aluno: { select: { id: true, nome: true } },
      mentor: { select: { id: true, nome: true } },
    },
  });
  return NextResponse.json(mentoria);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.mentoria.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
