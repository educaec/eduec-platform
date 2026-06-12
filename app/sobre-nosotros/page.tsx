export default function SobreNosotrosPage() {
  return (
    <div className="pt-32 max-w-4xl mx-auto px-6">

      {/* TÍTULO PRINCIPAL */}
      <h1 className="text-5xl font-bold text-gray-900 mb-6">
        Sobre <span className="text-blue-600">Nosotros</span>
      </h1>

      <p className="text-gray-600 text-lg leading-relaxed mb-10 max-w-2xl">
        Esta plataforma nació con un objetivo claro: ofrecer educación accesible, moderna
        y adaptada a las necesidades reales de los estudiantes ecuatorianos.
      </p>

      {/* PERFIL PERSONAL */}
      <div
        className="
          bg-white/80 backdrop-blur-xl border border-gray-200 
          shadow-xl rounded-2xl p-8 flex flex-col items-center text-center
        "
      >
        {/* FOTO */}
        <img
          src="/perfil/pablo.png"
          alt="Foto de Pablo Ágila"
          className="w-40 h-40 rounded-full object-cover shadow-lg mb-6 border-4 border-white"
        />

        {/* NOMBRE */}
        <h2 className="text-3xl font-semibold text-gray-900 mb-2">
          EduEc
        </h2>

        <p className="text-gray-600 text-md mb-6">
          Matemáticos, educadores y desarrolladores independiente.
        </p>

        {/* MOTIVACIÓN */}
        <p className="text-gray-700 text-lg leading-relaxed max-w-2xl">
          Nuestro propósito con EduEc es garantizar el acceso al aprendizaje, romper
          barreras económicas y brindar herramientas reales para que cada estudiante
          ecuatoriano pueda avanzar hacia sus metas.  
          <br /><br />
          Creé esta plataforma porque creo firmemente que una educación de calidad 
          puede transformar vidas, abrir oportunidades y construir un futuro más justo.
        </p>
      </div>

      {/* MISIÓN Y VISIÓN */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* MISIÓN */}
        <div className="bg-white border border-gray-200 shadow-lg rounded-2xl p-8">
          <h3 className="text-2xl font-semibold text-blue-600 mb-4">
            Misión
          </h3>
          <p className="text-gray-700 leading-relaxed text-lg text-justify">
            Complementar la educación en el Ecuador garantizando el acceso al conocimiento
            a través de herramientas digitales innovadoras, permitiendo que estudiantes y 
            docentes de todo el país conecten, aprendan y crezcan sin barreras geográficas 
            ni sociales.
          </p>
        </div>

        {/* VISIÓN */}
        <div className="bg-white border border-gray-200 shadow-lg rounded-2xl p-8">
          <h3 className="text-2xl font-semibold text-blue-600 mb-4">
            Visión
          </h3>
          <p className="text-gray-700 leading-relaxed text-lg  text-justify">
            Ser la plataforma educativa referente en el Ecuador para el año 2030, 
            reconocida por reducir la brecha digital y elevar los estándares de 
            calidad académica, contribuyendo activamente al desarrollo social y 
            profesional de la juventud.
          </p>
        </div>

      </div>
    </div>
  );
}
