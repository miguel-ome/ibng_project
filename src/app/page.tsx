"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Montserrat } from "next/font/google";
import { v4 as uuidv4 } from "uuid";
import { useCookies } from "react-cookie"; // Certifique-se de instalar: npm install react-cookie

const montserrat = Montserrat({ subsets: ["latin"] });

const questions = [
  {
    id: 1,
    text: "Qual é a importância da sua família na sua vida espiritual?",
    type: "radio",
    options: [
      "É minha base e meu primeiro exemplo de fé.",
      "Às vezes influencia, às vezes não.",
      "Não tem muita relação com minha fé.",
      "Nunca pensei nisso antes.",
    ],
  },
  {
    id: 2,
    text: "Como você pode demonstrar amor por seus pais no dia a dia?",
    type: "radio",
    options: [
      "Ouvindo e obedecendo com respeito.",
      "Ajudando em casa quando sou lembrado.",
      "Evitando discussões.",
      "Não tenho certeza de como mostrar.",
    ],
  },
  {
    id: 3,
    text: "Seus amigos te aproximam ou te afastam de Deus?",
    type: "radio",
    options: [
      "Me aproximam, falamos de fé juntos.",
      "Depende do momento.",
      "Me afastam, mas tento resistir.",
      "Não penso nisso quando estou com eles.",
    ],
  },
  {
    id: 4,
    text: "O que você pode aprender com a amizade de Jesus com os discípulos?",
    type: "radio",
    options: [
      "Que amigos devem ser leais e amorosos.",
      "Que devo escolher bem com quem ando.",
      "Que devo estar disposto a servir meus amigos.",
      "Todas as alternativas acima.",
    ],
  },
  {
    id: 5,
    text: "Como lidar com amizades que te afastam de Deus?",
    type: "radio",
    options: [
      "Orando por eles e sendo um exemplo.",
      "Me afastando com respeito.",
      "Conversando com eles sobre minha fé.",
      "Todas estão certas dependendo da situação.",
    ],
  },
  {
    id: 6,
    text: "Você já orou pedindo direção a Deus sobre seus sonhos?",
    type: "radio",
    options: [
      "Sim, sempre que tenho um plano.",
      "Às vezes, mas esqueço.",
      "Nunca pensei que Deus se importa com isso.",
      "Não tenho certeza se meus sonhos vêm de Deus.",
    ],
  },
  {
    id: 7,
    text: "Que sonhos você tem para o futuro e como eles podem glorificar a Deus?",
    type: "textarea",
  },
  {
    id: 8,
    text: "Quais obstáculos você enfrenta para realizar seus sonhos com Deus?",
    type: "radio",
    options: [
      "Insegurança e medo.",
      "Falta de apoio das pessoas.",
      "Dificuldade em confiar em Deus.",
      "Todos os anteriores.",
    ],
  },
  {
    id: 9,
    text: "Você acredita que Deus tem um plano especial para sua vida? Por quê?",
    type: "textarea",
  },
  {
    id: 10,
    text: "Se você pudesse pedir algo a Deus hoje sobre seu futuro, o que pediria?",
    type: "textarea",
  },
  {
    id: 11,
    text: "Você sonha em ter uma família no futuro?",
    type: "radio",
    options: [
      "Sim, e oro para que seja segundo a vontade de Deus.",
      "Sim, mas ainda tenho dúvidas sobre como será.",
      "Talvez, mas não penso muito nisso agora.",
      "Não tenho esse sonho.",
    ],
  },
  {
    id: 12,
    text: "Que tipo de lar você gostaria de construir?",
    type: "radio",
    options: [
      "Um lar com amor, respeito e fé em Deus.",
      "Um lar onde as pessoas se sintam livres e felizes.",
      "Um lar melhor do que o que eu tive.",
      "Ainda não pensei sobre isso.",
    ],
  },
  {
    id: 13,
    text: "O que você acha que é essencial em um relacionamento para formar uma família saudável a luz da Bíblia ?",
    type: "radio",
    options: [
      "Amor e compromisso com Deus.",
      "Diálogo e respeito mútuo.",
      "Apoio emocional e fidelidade.",
      "Estabilidade financeira.",
    ],
  },
  {
    id: 14,
    text: "Você já orou pedindo direção a Deus sobre com quem vai se casar no futuro?",
    type: "radio",
    options: [
      "Sim, acredito que Deus se importa com isso.",
      "Já pensei, mas nunca orei.",
      "Não, acho cedo pra isso.",
      "Não acredito que Deus se importe com isso.",
    ],
  },
];

const QuestionForm = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const router = useRouter();
  const [cookies, setCookie] = useCookies(["sessionId"]); // Obtenha a instância de cookies

  const currentQuestion = questions[currentQuestionIndex];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  useEffect(() => {
    if (!cookies.sessionId) {
      const newSessionId = uuidv4();
      setCookie("sessionId", newSessionId, { path: "/", sameSite: "strict" });
      console.log("Novo Session ID definido no cookie:", newSessionId);
    } else {
      console.log("Session ID do cookie existente:", cookies.sessionId);
      // Opcional: Recuperar as respostas salvas do banco de dados usando o sessionId
    }
  }, [cookies.sessionId, setCookie]);

  const sendAnswerToServer = async (questionId: number, answer: string) => {
    const sessionId = cookies.sessionId;
    if (!sessionId) {
      console.error("Session ID não encontrado.");
      return;
    }

    try {
      const response = await fetch("/api/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ questionId, answer, sessionId }), // Incluímos sessionId no corpo (opcional, já está no cookie)
      });

      if (response.ok) {
        console.log(
          `Resposta da pergunta ${questionId} salva no banco de dados!`
        );
        // Opcional: Atualizar o estado local 'answers' com a resposta salva
      } else {
        const errorData = await response.json();
        console.error(
          `Erro ao salvar resposta da pergunta ${questionId}:`,
          errorData
        );
        // Opcional: Mostrar mensagem de erro ao usuário
      }
    } catch (error) {
      console.error(
        `Erro ao enviar resposta da pergunta ${questionId}:`,
        error
      );
      // Opcional: Mostrar mensagem de erro ao usuário
    }
  };

  const handleAnswerChange = (event) => {
    const { name, value, type, checked } = event.target;
    let currentAnswer;
    if (type === "radio") {
      currentAnswer = value;
      setAnswers({ ...answers, [name]: value });
    } else if (type === "checkbox") {
      const currentAnswers = answers[name] || [];
      if (checked) {
        currentAnswer = [...currentAnswers, value];
        setAnswers({ ...answers, [name]: currentAnswer });
      } else {
        currentAnswer = currentAnswers.filter((v) => v !== value);
        setAnswers({ ...answers, [name]: currentAnswer });
      }
    } else if (type === "textarea") {
      currentAnswer = value;
      setAnswers({ ...answers, [name]: value });
    }

    // Enviar a resposta para o servidor assim que ela muda
    sendAnswerToServer(currentQuestion.id, currentAnswer);
  };

  const goToNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const goToPreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
  };

  const handleFinish = () => {
    router.push("/agradecimento"); // Redireciona para uma página de agradecimento
    // Opcional: Enviar um sinal para o backend de que o formulário foi concluído
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div
        className={`bg-white shadow-xl rounded-xl p-8 sm:p-12 w-full max-w-md sm:max-w-lg ${montserrat.className}`}
      >
        <h1 className="text-3xl font-semibold text-gray-800 text-center mb-8 tracking-tight">
          Reflexão Pessoal
        </h1>
        {currentQuestion && (
          <div key={currentQuestion.id} className="mb-6">
            <h2 className="text-lg font-medium text-gray-700 mb-4">
              Pergunta {currentQuestion.id}: {currentQuestion.text}
            </h2>
            {currentQuestion.type === "radio" &&
              currentQuestion.options?.map((option) => (
                <div key={option} className="flex items-center py-2">
                  <input
                    type="radio"
                    id={`question-${currentQuestion.id}-${option}`}
                    name={`question-${currentQuestion.id}`}
                    value={option}
                    checked={
                      answers[`question-${currentQuestion.id}`] === option
                    }
                    onChange={handleAnswerChange}
                    className="mr-3 focus:ring-blue-500 h-5 w-5 text-blue-600 border-gray-300"
                  />
                  <label
                    htmlFor={`question-${currentQuestion.id}-${option}`}
                    className="text-gray-800"
                  >
                    {option}
                  </label>
                </div>
              ))}
            {currentQuestion.type === "checkbox" &&
              currentQuestion.options?.map((option) => (
                <div key={option} className="flex items-center py-2">
                  <input
                    type="checkbox"
                    id={`question-${currentQuestion.id}-${option}`}
                    name={`question-${currentQuestion.id}`}
                    value={option}
                    checked={(
                      answers[`question-${currentQuestion.id}`] || []
                    ).includes(option)}
                    onChange={handleAnswerChange}
                    className="mr-3 focus:ring-blue-500 h-5 w-5 text-blue-600 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`question-${currentQuestion.id}-${option}`}
                    className="text-gray-800"
                  >
                    {option}
                  </label>
                </div>
              ))}
            {currentQuestion.type === "textarea" && (
              <textarea
                id={`question-${currentQuestion.id}`}
                name={`question-${currentQuestion.id}`}
                value={answers[`question-${currentQuestion.id}`] || ""}
                onChange={handleAnswerChange}
                rows={4}
                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
              />
            )}
            <div className="mt-8 flex justify-between items-center">
              <button
                onClick={goToPreviousQuestion}
                disabled={isFirstQuestion}
                className={`px-4 py-2 rounded-md font-semibold text-sm ${
                  isFirstQuestion
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-gray-900 hover:bg-gray-800 text-white cursor-pointer"
                }`}
              >
                Anterior
              </button>
              {!isLastQuestion ? (
                <button
                  onClick={goToNextQuestion}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 cursor-pointer text-white rounded-md font-semibold text-sm"
                >
                  Próximo
                </button>
              ) : (
                <button
                  onClick={handleFinish}
                  className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-md font-semibold text-sm"
                >
                  Finalizar
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionForm;
