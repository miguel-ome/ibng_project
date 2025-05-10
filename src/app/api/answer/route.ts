import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { questionId, answer } = await request.json();

    const cookieStore = cookies();
    let sessionId = (await cookieStore).get("sessionId")?.value;

    console.log("Este é o id:" + sessionId);
    if (!sessionId) {
      // 1. Criar a sessão no banco de dados *primeiro*
      sessionId = uuidv4();
      try {
        const novaSessao = await prisma.formularioSessao.create({
          data: {
            id: sessionId,
            respostas: [{ questionId, answer }], // Já inclui a primeira resposta
          },
        });
        console.log("Nova sessão criada no banco de dados:", novaSessao);
      } catch (dbError) {
        console.error("Erro ao criar sessão no banco de dados:", dbError);
        return NextResponse.json(
          { error: "Erro ao criar sessão no banco de dados." },
          { status: 500 }
        );
      }

      // 2. Definir o cookie *depois* de criar a sessão no banco de dados
      (await cookieStore).set("sessionId", sessionId);
      console.log("Nova Session ID definida no cookie:", sessionId);

      return NextResponse.json(
        { message: "Resposta salva e sessão iniciada!", sessionId },
        { status: 200 }
      );
    } else {
      console.log("Sessão ID do cookie:", sessionId);
      const session = await prisma.formularioSessao.findUnique({
        where: { id: sessionId },
      });

      if (session) {
        console.log("Sessão existente encontrada:", session);
        const existingRespostas = session.respostas as any[];

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
          console.log("Resposta existente substituída:", updatedRespostas);
        } else {
          updatedRespostas = [...existingRespostas, { questionId, answer }];
          console.log("Nova resposta adicionada:", updatedRespostas);
        }

        const updatedSessao = await prisma.formularioSessao.update({
          where: { id: sessionId },
          data: { respostas: updatedRespostas },
        });
        console.log("Sessão atualizada no banco de dados:", updatedSessao);
        return NextResponse.json(
          { message: "Resposta salva!" },
          { status: 200 }
        );
      } else {
        // ***ADICIONE ESTE BLOCO***
        console.log("Sessão não encontrada para o ID:", sessionId);
        return NextResponse.json(
          { error: "Sessão não encontrada." },
          { status: 404 }
        );
        // ***ADICIONE ESTE BLOCO***
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
