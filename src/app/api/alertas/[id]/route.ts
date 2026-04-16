import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const alerta = await prisma.alerta.update({
    where: { id },
    data: {
      status: body.status,
      resolvidoEm: body.status === "RESOLVIDO" ? new Date() : null,
    },
  });
  return NextResponse.json(alerta);
}
