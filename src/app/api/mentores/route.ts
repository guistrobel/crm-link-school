import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  const mentores = await prisma.mentor.findMany({
    include: {
      _count: { select: { alunos: true, mentorias: true } },
    },
    orderBy: { nome: "asc" },
  });
  return NextResponse.json(mentores);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const passwordHash = await bcrypt.hash(body.password || "mentor123", 10);

  const user = await prisma.user.create({
    data: {
      email: body.email,
      name: body.nome,
      passwordHash,
      role: "MENTOR",
    },
  });

  const mentor = await prisma.mentor.create({
    data: {
      userId: user.id,
      nome: body.nome,
      email: body.email,
      especialidade: body.especialidade || null,
    },
  });

  return NextResponse.json(mentor, { status: 201 });
}
