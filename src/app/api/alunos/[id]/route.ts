import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const aluno = await prisma.aluno.findUnique({
    where: { id },
    include: {
      mentor: { select: { id: true, nome: true, email: true } },
      tags: true,
      mentorias: { orderBy: { dataAgendada: "desc" }, include: { mentor: { select: { nome: true } } } },
      okrs: { include: { keyResults: true } },
      alertas: { orderBy: { criadoEm: "desc" } },
    },
  });
  if (!aluno) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(aluno);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const aluno = await prisma.aluno.update({
    where: { id },
    data: {
      nome: body.nome,
      email: body.email,
      telefone: body.telefone || null,
      cursoInteresse: body.cursoInteresse || null,
      dataMatricula: body.dataMatricula ? new Date(body.dataMatricula) : null,
      status: body.status,
      canalOrigem: body.canalOrigem || null,
      mentorId: body.mentorId || null,
      npsScore: body.npsScore != null ? Number(body.npsScore) : null,
      resultadoLink: body.resultadoLink || null,
      observacoes: body.observacoes || null,
    },
    include: {
      mentor: { select: { id: true, nome: true } },
      tags: true,
    },
  });
  return NextResponse.json(aluno);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.aluno.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
