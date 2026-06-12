import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

type QuestionInput = {
  statement: string;
  options: string[];
  correct: number;
  university: string;
  subject: string;
};

async function main() {
  const filePath = path.join(
    process.cwd(),
    "data/questions/uce-matematicas.json"
  );

  const raw = fs.readFileSync(filePath, "utf-8");
  const questions = JSON.parse(raw) as QuestionInput[];

  if (!Array.isArray(questions)) {
    throw new Error("El archivo JSON debe contener un arreglo de preguntas.");
  }

  for (const question of questions) {
    if (
      !question.statement ||
      !Array.isArray(question.options) ||
      question.options.length < 2 ||
      typeof question.correct !== "number" ||
      !question.university ||
      !question.subject
    ) {
      throw new Error(`Pregunta inválida: ${JSON.stringify(question)}`);
    }

    await prisma.question.create({
      data: {
        statement: question.statement,
        options: question.options,
        correct: question.correct,
        university: question.university,
        subject: question.subject,
      },
    });
  }

  console.log(`Se cargaron ${questions.length} preguntas correctamente.`);
}

main()
  .catch((error) => {
    console.error("Error cargando preguntas:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });