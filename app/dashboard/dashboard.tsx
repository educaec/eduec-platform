export default function Dashboard() {
  return (
    <div className="pt-32 max-w-5xl mx-auto">

      {/* TÍTULO PRINCIPAL */}
      <h1 className="text-4xl font-semibold tracking-tight mb-4">
        Tu panel de aprendizaje
      </h1>

      <p className="text-gray-400 mb-12 leading-relaxed">
        Revisa tu progreso, continúa tus cursos y accede rápidamente a los simuladores.
      </p>

      {/* GRID GENERAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* COLUMNA 1 — PROGRESO GENERAL */}
        <div className="
          bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6 
          shadow-lg h-max
        ">
          <h2 className="text-xl font-semibold mb-4">Progreso general</h2>

          <p className="text-gray-300 mb-2">Curso actual:</p>
          <p className="font-medium text-white mb-4">
            Fundamentos de Matemáticas
          </p>

          {/* BARRA DE PROGRESO */}
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-500" 
              style={{ width: "35%" }}
            />
          </div>

          <p className="text-sm text-gray-300 mt-2">35% completado</p>
        </div>

        {/* COLUMNA 2 — CURSOS EN PROGRESO */}
        <div className="lg:col-span-2 space-y-6">

          <h2 className="text-xl font-semibold mb-2">Cursos en progreso</h2>

          {/* CURSO 1 */}
          <div className="
            bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6 
            shadow-lg transition-all hover:bg-white/15
          ">
            <h3 className="text-2xl font-semibold mb-2">Fundamentos de Matemáticas</h3>
            <p className="text-gray-300 mb-4">
              Continúa aprendiendo conceptos clave para resolver problemas matemáticos.
            </p>

            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-blue-600" style={{ width: "35%" }} />
            </div>

            <a 
              href="/cursos/fundamentos-matematicas/leccion-1"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-medium transition"
            >
              Continuar curso
            </a>
          </div>

          {/* CURSO 2 */}
          <div className="
            bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6 
            shadow-lg transition-all hover:bg-white/15
          ">
            <h3 className="text-2xl font-semibold mb-2">Lectura Crítica</h3>
            <p className="text-gray-300 mb-4">
              Mejora tu comprensión textual y análisis crítico.
            </p>

            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-blue-600" style={{ width: "20%" }} />
            </div>

            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-medium transition">
              Continuar curso
            </button>
          </div>

        </div>
      </div>

      {/* SIMULADORES */}
      <h2 className="text-2xl font-semibold mt-16 mb-6">Simuladores</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* SIMULADOR MATEMÁTICAS */}
        <div className="
          bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/10 
          shadow-lg transition hover:bg-white/15
        ">
          <h3 className="text-xl font-semibold mb-3">Simulador de Matemáticas</h3>
          <p className="text-gray-300 mb-6">Pon a prueba tu razonamiento y cálculos.</p>
          <a 
            href="/simulador"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition"
          >
            Ir al simulador
          </a>
        </div>

        {/* SIMULADOR LENGUAJE */}
        <div className="
          bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/10 
          shadow-lg transition hover:bg-white/15
        ">
          <h3 className="text-xl font-semibold mb-3">Simulador de Lenguaje</h3>
          <p className="text-gray-300 mb-6">
            Practica comprensión lectora y gramática.
          </p>
          <a 
            href="/simulador-lenguaje"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition"
          >
            Ir al simulador
          </a>
        </div>

      </div>

      {/* ESTADÍSTICAS */}
      <h2 className="text-2xl font-semibold mt-16 mb-6">Estadísticas</h2>

      <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-lg">
        <p className="text-gray-300 mb-4">
          Distribución aproximada de tu progreso por área:
        </p>

        <div className="space-y-4">
          {/* Matemáticas */}
          <div>
            <div className="flex justify-between text-sm text-gray-300 mb-1">
              <span>Matemáticas</span>
              <span>60%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500" style={{ width: "60%" }} />
            </div>
          </div>

          {/* Lenguaje */}
          <div>
            <div className="flex justify-between text-sm text-gray-300 mb-1">
              <span>Lenguaje</span>
              <span>45%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-blue-400" style={{ width: "45%" }} />
            </div>
          </div>

          {/* Razonamiento lógico */}
          <div>
            <div className="flex justify-between text-sm text-gray-300 mb-1">
              <span>Razonamiento lógico</span>
              <span>30%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-blue-300" style={{ width: "30%" }} />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
