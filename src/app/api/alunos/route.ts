import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const mentorId = searchParams.get("mentorId") || "";

  const where: any = {};
  if (search) {
    where.OR = [
      { nome: { contains: search } },
      { email: { contains: search } },
    ];
  }
  if (status) where.status = status;
  if (mentorId) where.mentorId = mentorId;

  const alunos = await prisma.aluno.findMany({
    where,
    include: {
      mentor: { select: { id: true, nome: true } },
      tags: true,
      _count: { select: { mentorias: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(alunos);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const aluno = await prisma.aluno.create({
    data: {
      nome: body.nome,
      email: body.email,
      telefone: body.telefone || null,
      cursoInteresse: body.cursoInteresse || null,
      dataMatricula: body.dataMatricula ? new Date(body.dataMatricula) : null,
      status: body.status || "LEAD_FRIO",
      canalOrigem: body.canalOrigem || null,
      mentorId: body.mentorId || null,
      observacoes: body.observacoes || null,
    },
    include: {
      mentor: { select: { id: true, nome: true } },
      tags: true,
    },
  });
  return NextResponse.json(aluno, { status: 201 });
}
