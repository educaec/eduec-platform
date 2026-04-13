"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import LatexText from "@/components/LatexText";

type Question = {
  id: string;
  statement: string;
  options: string[];
  correct: number;
};

type AnswerState = "correct" | "incorrect" | null;
type SimulatorMode = "test" | "practice" | null;

const TEST_DURATION_SECONDS = 30 * 60; // 30 minutos
const SIMULATOR_TITLE = "UCE - Matemáticas";

function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export default function SimuladorUCEMatematicasPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [answerState, setAnswerState] = useState<AnswerState>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  const [mode, setMode] = useState<SimulatorMode>(null);
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION_SECONDS);
  const [timeExpired, setTimeExpired] = useState(false);

  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const hasSavedResult = useRef(false);

  useEffect(() => {
    async function loadQuestions() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/questions/uce/matematicas", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("No se pudieron cargar las preguntas.");
        }

        const data: Question[] = await res.json();

        if (!Array.isArray(data) || data.length === 0) {
          setQuestions([]);
          return;
        }

        const shuffledQuestions = shuffleArray(data).map((question) => {
          const indexedOptions = question.options.map((option, index) => ({
            option,
            originalIndex: index,
          }));

          const shuffledOptions = shuffleArray(indexedOptions);

          return {
            ...question,
            options: shuffledOptions.map((item) => item.option),
            correct: shuffledOptions.findIndex(
              (item) => item.originalIndex === question.correct
            ),
          };
        });

        setQuestions(shuffledQuestions);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Ocurrió un error inesperado."
        );
      } finally {
        setLoading(false);
      }
    }

    loadQuestions();
  }, [retryKey]);

  useEffect(() => {
    if (!started || mode !== "test" || finished) return;

    if (timeLeft <= 0) {
      setTimeExpired(true);
      setFinished(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [started, mode, timeLeft, finished]);

  async function saveProgress(finalScore: number) {
    try {
      const res = await fetch("/api/simulator-progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          simulatorTitle: SIMULATOR_TITLE,
          score: finalScore,
        }),
      });

      if (res.ok) {
        setSaveMessage("Resultado guardado correctamente.");
        return;
      }

      const text = await res.text().catch(() => "");
      console.error("No se pudo guardar el progreso:", {
        status: res.status,
        statusText: res.statusText,
        body: text,
      });

      if (res.status === 401) {
        setSaveMessage("Inicia sesión para guardar tu resultado.");
      } else {
        setSaveMessage("No se pudo guardar el resultado.");
      }
    } catch (error) {
      console.error("No se pudo guardar el progreso:", error);
      setSaveMessage("No se pudo guardar el resultado.");
    }
  }

  useEffect(() => {
    if (!finished || hasSavedResult.current || !started) return;

    hasSavedResult.current = true;
    saveProgress(score);
  }, [finished, score, started]);

  const totalQuestions = questions.length;

  const progressPercent = useMemo(() => {
    if (totalQuestions === 0) return 0;
    return ((current + 1) / totalQuestions) * 100;
  }, [current, totalQuestions]);

  const restartSimulator = () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setAnswered(false);
    setAnswerState(null);
    setMode(null);
    setStarted(false);
    setTimeLeft(TEST_DURATION_SECONDS);
    setTimeExpired(false);
    setSaveMessage(null);
    hasSavedResult.current = false;
    setRetryKey((prev) => prev + 1);
  };

  const startSimulator = (selectedMode: SimulatorMode) => {
    setMode(selectedMode);
    setStarted(true);
    setTimeLeft(TEST_DURATION_SECONDS);
    setTimeExpired(false);
    setSaveMessage(null);
    hasSavedResult.current = false;
  };

  const handleCheckAnswer = () => {
    if (selected === null || answered) return;

    const isCorrect = selected === questions[current].correct;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setAnswerState("correct");
    } else {
      setAnswerState("incorrect");
    }

    setAnswered(true);
  };

  const handleNext = () => {
    if (!answered) return;

    if (current + 1 < questions.length) {
      setCurrent((prev) => prev + 1);
      setSelected(null);
      setAnswered(false);
      setAnswerState(null);
    } else {
      setFinished(true);
    }
  };

  if (loading) {
    return (
      <div className="pt-32 px-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Simulador UCE - Matemáticas</h1>
        <p>Cargando preguntas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-32 px-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Simulador UCE - Matemáticas</h1>
        <div className="border rounded-2xl p-6 bg-white shadow-sm">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={restartSimulator}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="pt-32 px-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Simulador UCE - Matemáticas</h1>
        <div className="border rounded-2xl p-6 bg-white shadow-sm">
          <p className="mb-4">No hay preguntas disponibles para este simulador.</p>
          <button
            onClick={restartSimulator}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Recargar
          </button>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="pt-32 px-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Simulador UCE - Matemáticas</h1>

        <div className="border rounded-2xl p-8 bg-white shadow-sm space-y-6">
          <p className="text-gray-700 leading-relaxed">
            Antes de comenzar, elige el modo en el que deseas rendir este simulador.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => startSimulator("test")}
              className="text-left border rounded-2xl p-6 hover:bg-gray-50 transition"
            >
              <h2 className="text-xl font-semibold mb-2">
                Iniciar simulador tipo test
              </h2>
              <p className="text-gray-600">
                Modo con cronómetro de 30 minutos. Ideal para practicar bajo presión de tiempo.
              </p>
            </button>

            <button
              onClick={() => startSimulator("practice")}
              className="text-left border rounded-2xl p-6 hover:bg-gray-50 transition"
            >
              <h2 className="text-xl font-semibold mb-2">
                Iniciar simulador tipo práctica
              </h2>
              <p className="text-gray-600">
                Modo sin cronómetro. Ideal para resolver con calma y estudiar el contenido.
              </p>
            </button>
          </div>

          <Link
            href="/simulador/universidades-publicas"
            className="inline-block px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
          >
            Volver a universidades
          </Link>
        </div>
      </div>
    );
  }

  if (finished) {
    const percentage = Math.round((score / questions.length) * 100);

    let message = "Buen intento. Sigue practicando para mejorar tu rendimiento.";

    if (percentage >= 90) {
      message = "Excelente resultado. Tienes un dominio muy sólido de este bloque.";
    } else if (percentage >= 70) {
      message = "Muy buen trabajo. Vas por buen camino.";
    } else if (percentage >= 50) {
      message = "Resultado aceptable, pero aún hay temas por reforzar.";
    }

    return (
      <div className="pt-32 px-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Resultado final</h1>

        <div className="border rounded-2xl p-8 bg-white shadow-sm space-y-4">
          {timeExpired && (
            <div className="p-4 rounded-xl bg-yellow-100 text-yellow-800">
              El tiempo se ha agotado. El simulador finalizó automáticamente.
            </div>
          )}

          <p className="text-xl">
            Obtuviste <strong>{score}</strong> de <strong>{questions.length}</strong> preguntas correctas.
          </p>

          <p className="text-lg">
            Porcentaje: <strong>{percentage}%</strong>
          </p>

          <p className="text-gray-700">{message}</p>

          <p className="text-sm text-gray-500">
            Modo utilizado:{" "}
            <strong>
              {mode === "test" ? "Tipo test con cronómetro" : "Tipo práctica sin cronómetro"}
            </strong>
          </p>

          {saveMessage && (
            <p
              className={`text-sm ${
                saveMessage.includes("correctamente")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {saveMessage}
            </p>
          )}

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={restartSimulator}
              className="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Reintentar
            </button>

            <Link
              href="/simulador/universidades-publicas"
              className="px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
            >
              Volver a universidades
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[current];

  return (
    <div className="pt-32 px-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Simulador UCE - Matemáticas</h1>

        {mode === "test" && (
          <div className="px-4 py-2 rounded-xl bg-gray-900 text-white font-semibold">
            Tiempo restante: {formatTime(timeLeft)}
          </div>
        )}
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>
            Pregunta {current + 1} de {questions.length}
          </span>
          <span>{Math.round(progressPercent)}%</span>
        </div>

        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="border rounded-2xl p-6 shadow-sm bg-white">
        <p className="font-semibold text-xl mb-6">
          <LatexText text={question.statement} />
        </p>

        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selected === index;
            const isCorrectOption = question.correct === index;
            const isWrongSelected =
              answered && isSelected && index !== question.correct;

            let className =
              "w-full text-left px-4 py-3 border rounded-lg transition ";

            if (answered) {
              if (isCorrectOption) {
                className += "bg-green-100 border-green-600 text-green-900";
              } else if (isWrongSelected) {
                className += "bg-red-100 border-red-600 text-red-900";
              } else {
                className += "bg-gray-50 border-gray-200 text-gray-700";
              }
            } else {
              if (isSelected) {
                className += "bg-blue-600 text-white border-blue-600";
              } else {
                className += "bg-white hover:bg-gray-100 border-gray-300";
              }
            }

            return (
              <button
                key={index}
                onClick={() => {
                  if (!answered) setSelected(index);
                }}
                disabled={answered}
                className={className}
              >
                <LatexText text={option} />
              </button>
            );
          })}
        </div>

        {answered && (
          <div
            className={`mt-6 p-4 rounded-xl ${
              answerState === "correct"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {answerState === "correct"
              ? "Correcto. Buena respuesta."
              : "Incorrecto. Revisa la opción resaltada en verde."}
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-4">
          {!answered ? (
            <button
              onClick={handleCheckAnswer}
              disabled={selected === null}
              className={`px-6 py-3 rounded-xl font-medium transition ${
                selected === null
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Responder
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-3 rounded-xl font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              {current + 1 < questions.length ? "Siguiente" : "Finalizar"}
            </button>
          )}

          <button
            onClick={restartSimulator}
            className="px-6 py-3 rounded-xl font-medium border border-gray-300 hover:bg-gray-100 transition"
          >
            Reiniciar
          </button>
        </div>
      </div>
    </div>
  );
}