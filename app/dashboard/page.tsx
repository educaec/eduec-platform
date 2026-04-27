import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

function getOverallCourseProgress(courses: { progress: number }[]) {
  if (!courses.length) return 0;

  const sum = courses.reduce((acc, c) => acc + c.progress, 0);
  return Math.round(sum / courses.length);
}

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    include: {
      courseProgress: {
        where: {
          progress: {
            gt: 0,
          },
        },
        include: {
          Course: true,
        },
      },
      simulatorProgress: {
        where: {
          bestScore: {
            gt: 0,
          },
        },
        include: {
          Simulator: true,
        },
      },
      Activity: {
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const courses = user.courseProgress.map((item) => ({
    id: item.id,
    title: item.Course.title,
    url: "/cursos",
    progress: item.progress,
  }));

  const simulators = user.simulatorProgress.map((item) => ({
    id: item.id,
    title: item.Simulator.title,
    url: "/simulador",
    bestScore: item.bestScore,
  }));

  const activities = user.Activity.map((item) => ({
    id: item.id,
    description: item.description,
  }));

  const overall = getOverallCourseProgress(courses);

  return (
    <div className="pt-32 max-w-5xl mx-auto px-6">
      <div className="flex justify-end mb-8">
        <a
          href="/dashboard/perfil"
          className="px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-xl transition font-medium"
        >
          Mi Perfil
        </a>
      </div>

      <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-4">
        Tu panel de aprendizaje
      </h1>

      <p className="text-gray-600 mb-12 leading-relaxed text-lg">
        Revisa tu progreso, continúa tus cursos y accede rápidamente a los
        simuladores.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Progreso general
          </h2>

          {courses.length > 0 ? (
            <>
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
                Basado en {courses.length} curso(s) iniciado(s).
              </p>
            </>
          ) : (
            <p className="text-gray-500 text-sm leading-relaxed">
              Aún no has iniciado cursos. Tu progreso aparecerá aquí cuando
              avances en alguna lección.
            </p>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Cursos en progreso
          </h2>

          {courses.length > 0 ? (
            courses.map((course) => (
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
            ))
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <p className="text-gray-500">
                Aún no tienes cursos en progreso.
              </p>
            </div>
          )}
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-16 mb-6">
        Simuladores
      </h2>

      {simulators.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {simulators.map((sim) => (
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
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <p className="text-gray-500">
            Aún no has completado ningún simulador.
          </p>
        </div>
      )}

      <h2 className="text-2xl font-semibold text-gray-900 mt-16 mb-6">
        Actividad reciente
      </h2>

      {activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
            >
              <p className="text-gray-700">{item.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <p className="text-gray-500">
            Aún no hay actividad reciente registrada.
          </p>
        </div>
      )}
    </div>
  );
}