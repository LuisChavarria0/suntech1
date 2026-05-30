export default function Loading() {
  return (
    <div className="fixed inset-0 bg-navy-900 flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-5">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full bg-gold-500/20 animate-ping" />
          <div className="absolute inset-2 rounded-full bg-gold-500/40 animate-pulse" />
          <div className="absolute inset-4 rounded-full bg-gold-500" />
        </div>
        <p className="text-navy-400 text-sm font-medium tracking-wide">Cargando...</p>
      </div>
    </div>
  );
}
