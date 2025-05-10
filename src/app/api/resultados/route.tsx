// app/api/resultados/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export async function GET() {
  const prisma = new PrismaClient();
  try {
    const sessoes = await prisma.formularioSessao.findMany();
    return NextResponse.json(sessoes);
  } catch (error) {
    console.error("Erro ao buscar as sessões do formulário:", error);
    return NextResponse.json(
      { error: "Erro ao buscar os resultados." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
