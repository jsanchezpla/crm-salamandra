export default function SealModal({ seal, onClose }) {
  if (!seal) return null;

  return (
    <div className="fixed inset-0 bg-[#40269A]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 lg:p-10">
      <div className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl relative animate-fadeIn border-t-8 border-[#C49DFF]">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 bg-gray-100 hover:bg-[#FFDAED] hover:text-[#FF0188] text-gray-500 rounded-full flex items-center justify-center font-black transition-colors z-10"
        >
          ✕
        </button>

        <div className="bg-[#fcfaff] p-8 text-center border-b border-gray-100">
          <h2 className="text-2xl font-black text-[#40269A]">Detalle de Transacción</h2>
          <p className="text-gray-400 font-bold mt-1 text-sm">
            ID Venta: #AUM-{seal.id.toString().padStart(4, "0")}
          </p>
        </div>

        <div className="p-8 space-y-4">
          <div className="flex justify-between border-b border-gray-50 pb-4">
            <span className="text-gray-400 font-bold uppercase text-xs tracking-wider">Fecha</span>
            <span className="text-[#40269A] font-bold">{seal.fecha}</span>
          </div>
          <div className="flex justify-between border-b border-gray-50 pb-4">
            <span className="text-gray-400 font-bold uppercase text-xs tracking-wider">Alumno</span>
            <span className="text-[#40269A] font-bold">{seal.alumno}</span>
          </div>
          <div className="flex justify-between border-b border-gray-50 pb-4">
            <span className="text-gray-400 font-bold uppercase text-xs tracking-wider">
              Curso Adquirido
            </span>
            <span className="text-[#40269A] font-bold">{seal.curso}</span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-[#C49DFF] font-black uppercase text-sm tracking-widest">
              Importe Total
            </span>
            <span className="text-[#FF0188] font-black text-3xl">{seal.importe}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
