import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
  try {
    // Excluir todos os registros da tabela FormularioSessao
    const deleteResult = await prisma.formularioSessao.deleteMany();

    // console.log("Registros excluídos:", deleteResult.count); // O .count não existe no deleteMany do prisma

    return NextResponse.json(
      { message: "Todos os registros excluídos com sucesso!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao excluir registros:", error);
    return NextResponse.json(
      { error: "Erro ao excluir registros." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
