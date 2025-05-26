const timeline = [
  { title: "Primer sueño", date: "12 Mayo" },
  { title: "Patrón descubierto", date: "18 Mayo" },
  { title: "Sesión con experto", date: "25 Mayo" },
  { title: "Insight personal", date: "2 Junio" },
];

export default function Timeline() {
  return (
    <div className="w-full bg-[#fae5df] py-16 px-4 text-center">
      <h2 className="text-4xl font-playfair text-oniria_darkblue mb-12 mt-5">
        Sigue tu progreso
      </h2>

      <div className="relative flex justify-between items-start max-w-6xl mx-auto mb-20 mt-16 font-inter">
        {/* Línea central */}
        <div className="absolute top-8 left-0 right-0 h-1 bg-[#c29cd9] z-0" />

        {/* Eventos */}
        {timeline.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center z-10 w-40">
            {/* Tarjeta */}
            <div className="bg-white shadow-lg p-3 rounded-lg mb-4 border border-[#ffd6f1]">
              <h3 className="font-semibold text-sm">{item.title}</h3>
              <p className="text-xs text-gray-500">{item.date}</p>
            </div>
            {/* Punto en la línea */}
            <div className="w-4 h-4 rounded-full bg-[#c29cd9]" />
          </div>
        ))}
      </div>
    </div>
  );
}
