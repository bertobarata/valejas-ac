export default function LiveTracker() {
  return (
    <div className="bg-blue p-6 relative overflow-hidden">
      {/* Background watermark */}
      <div className="absolute -right-6 -bottom-6 font-headline font-black text-[8rem] text-white/5 leading-none select-none pointer-events-none uppercase italic">
        Live
      </div>

      <div className="relative z-10">
        <div className="badge-live w-fit mb-4">Em Direto</div>
        <h3 className="font-headline font-black text-2xl uppercase tracking-tighter text-white mb-3">
          Live Tracking
        </h3>
        <p className="font-body text-sm text-white/70 leading-relaxed mb-6">
          Acompanha estatísticas em tempo real no dia de jogo na nossa APP.
        </p>
        <a
          href="#"
          className="inline-flex items-center gap-2 font-headline font-black text-xs uppercase tracking-widest text-white border border-white/30 px-5 py-3 hover:border-yellow hover:text-yellow transition-colors duration-200"
        >
          Download App →
        </a>
      </div>
    </div>
  );
}
