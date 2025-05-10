/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Função para processar as respostas e preparar os dados para o gráfico (mantemos esta função)
function processarRespostas(sessoes: any[]) {
  const contagemRespostas: {
    [questionId: string]: { [answer: string]: number };
  } = {};

  sessoes.forEach((sessao) => {
    sessao.respostas.forEach((resposta: any) => {
      const questionId = resposta.questionId;
      const answerValue = resposta.answer;

      if (!contagemRespostas[questionId]) {
        contagemRespostas[questionId] = {};
      }

      if (Array.isArray(answerValue)) {
        answerValue.forEach((value) => {
          contagemRespostas[questionId][value] =
            (contagemRespostas[questionId][value] || 0) + 1;
        });
      } else {
        contagemRespostas[questionId][answerValue] =
          (contagemRespostas[questionId][answerValue] || 0) + 1;
      }
    });
  });

  return contagemRespostas;
}

const ResultadosPage = () => {
  const [dadosGrafico, setDadosGrafico] = useState<{
    [questionId: string]: {
      labels: string[];
      datasets: { label: string; data: number[] }[];
    };
  }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar e atualizar os dados
  const carregarResultados = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/resultados");
      if (!response.ok) {
        throw new Error(`Erro ao buscar os resultados: ${response.status}`);
      }
      const data = await response.json();
      const respostasProcessadas = processarRespostas(data);
      const graficoData: {
        [questionId: string]: {
          labels: string[];
          datasets: { label: string; data: number[] }[];
        };
      } = {};

      for (const questionId in respostasProcessadas) {
        const labels = Object.keys(respostasProcessadas[questionId]);
        const graficoDataSets = Object.values(
          respostasProcessadas[questionId]
        ).map((count) => count);
        graficoData[questionId] = {
          labels: labels,
          datasets: [
            {
              label: `Pergunta ${questionId}`,
              data: graficoDataSets,
            },
          ],
        };
      }

      setDadosGrafico(graficoData);
      setLoading(false);
    } catch (err: any) {
      setError("Erro ao carregar os resultados.");
      setLoading(false);
      console.error(err);
    }
  };

  // Função para excluir todas as respostas
  const excluirRespostas = async () => {
    if (
      confirm(
        "Tem certeza de que deseja excluir todas as respostas? Esta ação não pode ser desfeita."
      )
    ) {
      try {
        const response = await fetch("/api/excluir-respostas", {
          method: "POST",
        });
        if (!response.ok) {
          throw new Error(`Erro ao excluir as respostas: ${response.status}`);
        }
        // Atualiza os gráficos após a exclusão
        await carregarResultados();
      } catch (err: any) {
        setError("Erro ao excluir as respostas.");
        console.error(err);
      }
    }
  };

  useEffect(() => {
    carregarResultados();
  }, []);

  if (loading) {
    return <div>Carregando os resultados...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Resultados das Reflexões
        </h1>
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={carregarResultados}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Atualizar Gráficos
          </button>
          <button
            onClick={excluirRespostas}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
          >
            Excluir Todas as Respostas
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.keys(dadosGrafico).map((questionId) => (
            <div
              key={questionId}
              className="bg-white shadow overflow-hidden rounded-md p-6"
            >
              <h2 className="text-xl font-medium text-gray-700 mb-4">
                Pergunta {questionId}
              </h2>
              <div
                style={{
                  maxWidth: "100%",
                  maxHeight: "400px",
                  margin: "0 auto",
                }}
              >
                <Bar
                  data={dadosGrafico[questionId]}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: {
                        position: "top" as const,
                      },
                      title: {
                        display: true,
                        text: `Pergunta ${questionId}`,
                        font: {
                          size: 16,
                        },
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultadosPage;
