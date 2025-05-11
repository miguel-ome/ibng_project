-- CreateTable
CREATE TABLE "FormularioSessao" (
    "id" TEXT NOT NULL,
    "respostas" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormularioSessao_pkey" PRIMARY KEY ("id")
);
