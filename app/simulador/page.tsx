import Link from "next/link";

type University = {
  name: string;
  description: string;
  href?: string;
  available: boolean;
};

const publicUniversities: University[] = [
  {
    name: "Simulador general de conocimientos",
    description:
      "Practica con preguntas de matemática, ciencias, lenguaje, razonamiento y conocimientos generales.",
    href: "/simulador/modelo/conocimientos",
    available: true,
  },
  {
    name: "Escuela Politécnica Nacional",
    description: "Preparación para el examen de conocimientos.",
    available: false,
  },
  {
    name: "Universidad Nacional de Chimborazo",
    description: "Razonamiento lógico, verbal y numérico.",
    available: false,
  },
  {
    name: "ESPOCH",
    description: "Simuladores de conocimientos para admisión.",
    available: false,
  },
];

const privateUniversities: University[] = [
  {
    name: "UTPL",
    description: "Preparación para procesos de admisión.",
    available: false,
  },
  {
    name: "UIDE",
    description: "Simuladores y material de preparación.",
    available: false,
  },
];

function UniversityCard({ university }: { university: University }) {
  return (
    <article className="flex h-full flex-col rounded-3xl border border-gray-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <h3 className="mb-3 text-xl font-semibold text-gray-900">
        {university.name}
      </h3>

      <p className="mb-6 flex-1 leading-relaxed text-gray-600">
        {university.description}
      </p>

      {university.available && university.href ? (
        <Link
          href={university.href}
          className="inline-flex w-fit rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
        >
          Ver simulador
        </Link>
      ) : (
        <span className="inline-flex w-fit cursor-not-allowed rounded-xl bg-gray-100 px-5 py-2.5 font-medium text-gray-500">
          Próximamente
        </span>
      )}
    </article>
  );
}

export default function SimuladorPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 pb-20 pt-32">
      <header className="mb-14">
        <h1 className="mb-5 text-5xl font-semibold tracking-tight text-gray-900">
          Simuladores de admisión
        </h1>

        <p className="max-w-3xl text-lg leading-relaxed text-gray-600">
          Selecciona una opción y practica con bancos de preguntas organizados
          por áreas de conocimiento y aptitudes.
        </p>
      </header>

      <section className="mb-16">
        <div className="mb-7">
          <h2 className="text-3xl font-semibold text-gray-900">
            Universidades públicas
          </h2>

          <p className="mt-2 text-gray-600">
            Preparación para procesos de admisión de instituciones públicas.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
          {publicUniversities.map((university) => (
            <UniversityCard
              key={university.name}
              university={university}
            />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-7">
          <h2 className="text-3xl font-semibold text-gray-900">
            Universidades privadas
          </h2>

          <p className="mt-2 text-gray-600">
            Simuladores para procesos de ingreso de instituciones privadas.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
          {privateUniversities.map((university) => (
            <UniversityCard
              key={university.name}
              university={university}
            />
          ))}
        </div>
      </section>
    </main>
  );
}