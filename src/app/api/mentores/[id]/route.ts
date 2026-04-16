import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const mentor = await prisma.mentor.findUnique({
    where: { id },
    include: {
      alunos: {
        include: {
          tags: true,
          _count: { select: { mentorias: true } },
        },
      },
      _count: { select: { alunos: true, mentorias: true } },
    },
  });
  if (!mentor) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(mentor);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const mentor = await prisma.mentor.update({
    where: { id },
    data: {
      nome: body.nome,
      email: body.email,
      especialidade: body.especialidade || null,
    },
  });
  return NextResponse.json(mentor);
}
