import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import { ISessions } from "@/interfaces/ISessions";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { questionId, answer } = await request.json();
    const cookieStore = cookies();
    let sessionId = (await cookieStore).get("sessionId")?.value;

    if (!sessionId) {
      sessionId = uuidv4();
      try {
        await prisma.formularioSessao.create({
          data: {
            id: sessionId,
            respostas: [{ questionId, answer }],
          },
        });
      } catch (dbError) {
        console.error("Erro ao criar sessão no banco de dados:", dbError);
        return NextResponse.json(
          { error: "Erro ao criar sessão no banco de dados." },
          { status: 500 }
        );
      }
      (await cookieStore).set("sessionId", sessionId);
      return NextResponse.json(
        { message: "Resposta salva e sessão iniciada!", sessionId },
        { status: 200 }
      );
    } else {
      const session = await prisma.formularioSessao.findUnique({
        where: { id: sessionId },
      });

      if (session) {
        const existingRespostas = session.respostas as unknown as ISessions[];
        const respostaIndex = existingRespostas.findIndex(
          (resp) => resp.questionId === questionId
        );

        let updatedRespostas;
        if (respostaIndex > -1) {
          updatedRespostas = [
            ...existingRespostas.slice(0, respostaIndex),
            { questionId, answer },
            ...existingRespostas.slice(respostaIndex + 1),
          ];
        } else {
          updatedRespostas = [...existingRespostas, { questionId, answer }];
        }

        await prisma.formularioSessao.update({
          where: { id: sessionId },
          data: { respostas: updatedRespostas },
        });
        return NextResponse.json(
          { message: "Resposta salva!" },
          { status: 200 }
        );
      } else {
        // Adicione este bloco para garantir que sempre haja um retorno
        await prisma.formularioSessao.create({
          data: {
            id: sessionId,
            respostas: [{ questionId, answer }],
          },
        });
        return NextResponse.json(
          { error: "Sessão não encontrada." },
          { status: 200 }
        );
      }
    }
  } catch (error) {
    console.error("Erro ao salvar/atualizar resposta:", error);
    return NextResponse.json(
      { error: "Erro ao salvar/atualizar resposta." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
