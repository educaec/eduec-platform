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

const TEST_DURATION_SECONDS = 30 * 60;

// Nombre usado por la API de progreso.
// Se conserva para no romper el registro existente en la base.
const SIMULATOR_TITLE = "UCE - Matemáticas";

// Título que verá el usuario.
const DISPLAY_TITLE = "Simulador general de conocimientos";

function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

function formatTime(seconds: number): string {
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

    const timer = window.setInterval(() => {
      setTimeLeft((previousTime) => {
        if (previousTime <= 1) {
          window.clearInterval(timer);
          setTimeExpired(true);
          setFinished(true);
          return 0;
        }

        return previousTime - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [started, mode, finished]);

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
    } catch (err) {
      console.error("No se pudo guardar el progreso:", err);
      setSaveMessage("No se pudo guardar el resultado.");
    }
  }

  useEffect(() => {
    if (!finished || hasSavedResult.current || !started) return;

    hasSavedResult.current = true;
    void saveProgress(score);
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
    setRetryKey((previous) => previous + 1);
  };

  const startSimulator = (selectedMode: Exclude<SimulatorMode, null>) => {
    setMode(selectedMode);
    setStarted(true);
    setTimeLeft(TEST_DURATION_SECONDS);
    setTimeExpired(false);
    setSaveMessage(null);
    hasSavedResult.current = false;
  };

  const handleCheckAnswer = () => {
    if (selected === null || answered) return;

    const question = questions[current];

    if (!question) return;

    const isCorrect = selected === question.correct;

    if (isCorrect) {
      setScore((previous) => previous + 1);
      setAnswerState("correct");
    } else {
      setAnswerState("incorrect");
    }

    setAnswered(true);
  };

  const handleNext = () => {
    if (!answered) return;

    if (current + 1 < questions.length) {
      setCurrent((previous) => previous + 1);
      setSelected(null);
      setAnswered(false);
      setAnswerState(null);
    } else {
      setFinished(true);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-6 pt-32">
        <h1 className="mb-8 text-3xl font-bold">{DISPLAY_TITLE}</h1>
        <p>Cargando preguntas...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-4xl px-6 pt-32">
        <h1 className="mb-8 text-3xl font-bold">{DISPLAY_TITLE}</h1>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="mb-4 text-red-600">{error}</p>

          <button
            onClick={restartSimulator}
            className="rounded-xl bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </main>
    );
  }

  if (questions.length === 0) {
    return (
      <main className="mx-auto max-w-4xl px-6 pt-32">
        <h1 className="mb-8 text-3xl font-bold">{DISPLAY_TITLE}</h1>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="mb-4">
            No hay preguntas disponibles para este simulador.
          </p>

          <button
            onClick={restartSimulator}
            className="rounded-xl bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
          >
            Recargar
          </button>
        </div>
      </main>
    );
  }

  if (!started) {
    return (
      <main className="mx-auto max-w-4xl px-6 pt-32">
        <h1 className="mb-8 text-3xl font-bold">{DISPLAY_TITLE}</h1>

        <div className="space-y-6 rounded-2xl border bg-white p-8 shadow-sm">
          <p className="leading-relaxed text-gray-700">
            Antes de comenzar, elige el modo en el que deseas rendir este
            simulador.
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <button
              onClick={() => startSimulator("test")}
              className="rounded-2xl border p-6 text-left transition hover:bg-gray-50"
            >
              <h2 className="mb-2 text-xl font-semibold">
                Iniciar simulador tipo test
              </h2>

              <p className="text-gray-600">
                Modo con cronómetro de 30 minutos. Ideal para practicar bajo
                presión de tiempo.
              </p>
            </button>

            <button
              onClick={() => startSimulator("practice")}
              className="rounded-2xl border p-6 text-left transition hover:bg-gray-50"
            >
              <h2 className="mb-2 text-xl font-semibold">
                Iniciar simulador tipo práctica
              </h2>

              <p className="text-gray-600">
                Modo sin cronómetro. Ideal para resolver con calma y estudiar
                el contenido.
              </p>
            </button>
          </div>

          <Link
            href="/simulador"
            className="inline-block rounded-xl border border-gray-300 px-6 py-3 transition hover:bg-gray-100"
          >
            Volver a simuladores
          </Link>
        </div>
      </main>
    );
  }

  if (finished) {
    const percentage = Math.round((score / questions.length) * 100);

    let message =
      "Buen intento. Sigue practicando para mejorar tu rendimiento.";

    if (percentage >= 90) {
      message =
        "Excelente resultado. Tienes un dominio muy sólido de este bloque.";
    } else if (percentage >= 70) {
      message = "Muy buen trabajo. Vas por buen camino.";
    } else if (percentage >= 50) {
      message = "Resultado aceptable, pero aún hay temas por reforzar.";
    }

    return (
      <main className="mx-auto max-w-4xl px-6 pt-32">
        <h1 className="mb-8 text-3xl font-bold">Resultado final</h1>

        <div className="space-y-4 rounded-2xl border bg-white p-8 shadow-sm">
          {timeExpired && (
            <div className="rounded-xl bg-yellow-100 p-4 text-yellow-800">
              El tiempo se ha agotado. El simulador finalizó automáticamente.
            </div>
          )}

          <p className="text-xl">
            Obtuviste <strong>{score}</strong> de{" "}
            <strong>{questions.length}</strong> preguntas correctas.
          </p>

          <p className="text-lg">
            Porcentaje: <strong>{percentage}%</strong>
          </p>

          <p className="text-gray-700">{message}</p>

          <p className="text-sm text-gray-500">
            Modo utilizado:{" "}
            <strong>
              {mode === "test"
                ? "Tipo test con cronómetro"
                : "Tipo práctica sin cronómetro"}
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
              className="rounded-xl bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
            >
              Reintentar
            </button>

            <Link
              href="/simulador"
              className="rounded-xl border border-gray-300 px-6 py-3 transition hover:bg-gray-100"
            >
              Volver a simuladores
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const question = questions[current];

  return (
    <main className="mx-auto max-w-4xl px-6 pt-32">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold">{DISPLAY_TITLE}</h1>

        {mode === "test" && (
          <div className="rounded-xl bg-gray-900 px-4 py-2 font-semibold text-white">
            Tiempo restante: {formatTime(timeLeft)}
          </div>
        )}
      </div>

      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm text-gray-600">
          <span>
            Pregunta {current + 1} de {questions.length}
          </span>

          <span>{Math.round(progressPercent)}%</span>
        </div>

        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-6 text-xl font-semibold">
          <LatexText text={question.statement} />
        </div>

        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selected === index;
            const isCorrectOption = question.correct === index;
            const isWrongSelected =
              answered && isSelected && index !== question.correct;

            let className =
              "w-full rounded-lg border px-4 py-3 text-left transition ";

            if (answered) {
              if (isCorrectOption) {
                className +=
                  "bg-green-100 border-green-600 text-green-900";
              } else if (isWrongSelected) {
                className += "bg-red-100 border-red-600 text-red-900";
              } else {
                className += "bg-gray-50 border-gray-200 text-gray-700";
              }
            } else if (isSelected) {
              className += "bg-blue-600 text-white border-blue-600";
            } else {
              className += "bg-white hover:bg-gray-100 border-gray-300";
            }

            return (
              <button
                key={`${question.id}-${index}`}
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
            className={`mt-6 rounded-xl p-4 ${
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
              className={`rounded-xl px-6 py-3 font-medium transition ${
                selected === null
                  ? "cursor-not-allowed bg-gray-300 text-gray-500"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Responder
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              {current + 1 < questions.length ? "Siguiente" : "Finalizar"}
            </button>
          )}

          <button
            onClick={restartSimulator}
            className="rounded-xl border border-gray-300 px-6 py-3 font-medium transition hover:bg-gray-100"
          >
            Reiniciar
          </button>
        </div>
      </div>
    </main>
  );
}