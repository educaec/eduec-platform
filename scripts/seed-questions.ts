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

  let createdCount = 0;
  let skippedCount = 0;

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

    const existing = await prisma.question.findFirst({
      where: {
        statement: question.statement,
        university: question.university,
        subject: question.subject,
      },
    });

    if (existing) {
      skippedCount++;
      console.log(`Pregunta omitida por duplicado: ${question.statement}`);
      continue;
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

    createdCount++;
  }

  console.log(`Preguntas nuevas cargadas: ${createdCount}`);
  console.log(`Preguntas omitidas por duplicado: ${skippedCount}`);
}

main()
  .catch((error) => {
    console.error("Error cargando preguntas:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });