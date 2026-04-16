import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "PENDENTE";
  const tipo = searchParams.get("tipo") || "";

  const where: any = {};
  if (status && status !== "TODOS") where.status = status;
  if (tipo) where.tipo = tipo;

  const alertas = await prisma.alerta.findMany({
    where,
    include: {
      aluno: {
        select: {
          id: true,
          nome: true,
          status: true,
          mentor: { select: { nome: true } },
        },
      },
    },
    orderBy: { criadoEm: "desc" },
  });
  return NextResponse.json(alertas);
}
