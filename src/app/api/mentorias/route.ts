import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const alunoId = searchParams.get("alunoId") || "";
  const mentorId = searchParams.get("mentorId") || "";
  const status = searchParams.get("status") || "";

  const where: any = {};
  if (alunoId) where.alunoId = alunoId;
  if (mentorId) where.mentorId = mentorId;
  if (status) where.status = status;

  const mentorias = await prisma.mentoria.findMany({
    where,
    include: {
      aluno: { select: { id: true, nome: true, status: true } },
      mentor: { select: { id: true, nome: true } },
    },
    orderBy: { dataAgendada: "desc" },
  });
  return NextResponse.json(mentorias);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Calculate sequence number
  const realizadas = await prisma.mentoria.count({
    where: {
      alunoId: body.alunoId,
      status: { in: ["REALIZADA", "AGENDADA"] },
    },
  });

  const mentoria = await prisma.mentoria.create({
    data: {
      alunoId: body.alunoId,
      mentorId: body.mentorId,
      tipo: body.tipo,
      dataAgendada: new Date(body.dataAgendada),
      dataRealizada: body.dataRealizada ? new Date(body.dataRealizada) : null,
      status: body.status || "AGENDADA",
      notaMentor: body.notaMentor ? Number(body.notaMentor) : null,
      feedbackQualitativo: body.feedbackQualitativo || null,
      entregaveisRecebidos: body.entregaveisRecebidos || false,
      sequenciaNumero: realizadas + 1,
    },
    include: {
      aluno: { select: { id: true, nome: true } },
      mentor: { select: { id: true, nome: true } },
    },
  });
  return NextResponse.json(mentoria, { status: 201 });
}
