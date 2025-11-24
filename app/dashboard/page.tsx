import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

/*  
==========================================================
📘 DASHBOARD DE APRENDIZAJE — VERSIÓN LIGHT PREMIUM
==========================================================
*/

type CourseProgress = {
  id: string;
  title: string;
  url: string;
  progress: number;
};

type SimulatorProgress = {
  id: string;
  title: string;
  url: string;
  bestScore: number;
};

type ActivityItem = {
  id: string;
  description: string;
};

const userProgress = {
  courses: [
    {
      id: "curso-mate",
      title: "Fundamentos de Matemáticas",
      url: "/cursos/fundamentos-matematicas/leccion-1",
      progress: 35,
    },
    {
      id: "curso-lectura",
      title: "Lectura Crítica",
      url: "#",
      progress: 20,
    },
  ] as CourseProgress[],

  simulators: [
    {
      id: "sim-mate",
      title: "Simulador de Matemáticas",
      url: "/simulador",
      bestScore: 70,
    },
    {
      id: "sim-lenguaje",
      title: "Simulador de Lenguaje",
      url: "/simulador",
      bestScore: 80,
    },
  ] as SimulatorProgress[],

  activity: [
    { id: "act1", description: "✔ Completaste la Lección 1 de Matemáticas." },
    { id: "act2", description: "🎯 Obtuviste 8/10 en el simulador de Lenguaje." },
  ] as ActivityItem[],
};

function getOverallCourseProgress(courses: CourseProgress[]) {
  if (!courses.length) return 0;
  const sum = courses.reduce((acc, c) => acc + c.progress, 0);
  return Math.round(sum / courses.length);
}

export default async function Dashboard() {
  const session = await getServerSession();
  if (!session) redirect("/login");

  const overall = getOverallCourseProgress(userProgress.courses);

  return (
    <div className="pt-32 max-w-5xl mx-auto px-6">

      {/* BOTÓN DE PERFIL */}
      <div className="flex justify-end mb-8">
        <a
          href="/dashboard/perfil"
          className="px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-xl transition font-medium"
        >
          Mi Perfil
        </a>
      </div>

      {/* TÍTULO PRINCIPAL */}
      <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-4">
        Tu panel de aprendizaje
      </h1>

      <p className="text-gray-600 mb-12 leading-relaxed text-lg">
        Revisa tu progreso, continúa tus cursos y accede rápidamente a los simuladores.
      </p>

      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* TARJETA: Progreso general */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Progreso general
          </h2>

          <p className="text-gray-700 mb-2">Promedio de tus cursos:</p>

          <p className="font-semibold text-gray-900 mb-4 text-lg">
            {overall}% completado
          </p>

          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-blue-600 transition-all duration-500"
              style={{ width: `${overall}%` }}
            />
          </div>

          <p className="text-xs text-gray-500">
            Basado en {userProgress.courses.length} curso(s).
          </p>
        </div>

        {/* CURSOS */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Cursos en progreso
          </h2>

          {userProgress.courses.map((course) => (
            <div
              key={course.id}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all"
            >
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                {course.title}
              </h3>

              <p className="text-gray-600 mb-4">
                Continúa donde lo dejaste y refuerza tus conocimientos.
              </p>

              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-blue-600"
                  style={{ width: `${course.progress}%` }}
                />
              </div>

              <p className="text-sm text-gray-500 mb-3">
                Progreso: {course.progress}%
              </p>

              <div className="flex justify-end">
                <a
                  href={course.url}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition"
                >
                  Continuar curso
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SIMULADORES */}
      <h2 className="text-2xl font-semibold text-gray-900 mt-16 mb-6">
        Simuladores
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {userProgress.simulators.map((sim) => (
          <div
            key={sim.id}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {sim.title}
            </h3>

            <p className="text-gray-600 mb-4">
              Mejor puntaje: {sim.bestScore}%
            </p>

            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${sim.bestScore}%` }}
              />
            </div>

            <div className="flex justify-end">
              <a
                href={sim.url}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition"
              >
                Ir al simulador
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* ACTIVIDAD */}
      <h2 className="text-2xl font-semibold text-gray-900 mt-16 mb-6">
        Actividad reciente
      </h2>

      <div className="space-y-4">
        {userProgress.activity.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
          >
            <p className="text-gray-700">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
