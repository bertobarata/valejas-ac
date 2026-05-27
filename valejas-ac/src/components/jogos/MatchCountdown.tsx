"use client";

import { useEffect, useState } from "react";

interface TimeLeft {
  dias: number;
  horas: number;
  mins: number;
  segs: number;
}

function calcTimeLeft(target: Date): TimeLeft {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    dias:  Math.floor(diff / (1000 * 60 * 60 * 24)),
    horas: Math.floor((diff / (1000 * 60 * 60)) % 24),
    mins:  Math.floor((diff / (1000 * 60)) % 60),
    segs:  Math.floor((diff / 1000) % 60),
  };
}

export default function MatchCountdown({ target }: { target: Date }) {
  const [time, setTime] = useState<TimeLeft>(calcTimeLeft(target));

  useEffect(() => {
    const id = setInterval(() => setTime(calcTimeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const units = [
    { value: time.dias,  label: "Dias" },
    { value: time.horas, label: "Horas" },
    { value: time.mins,  label: "Min" },
    { value: time.segs,  label: "Seg" },
  ];

  return (
    <div className="flex gap-3">
      {units.map(({ value, label }, i) => (
        <div
          key={label}
          className={`flex flex-col items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-surface-highest ${
            i === units.length - 1
              ? "border-b-2 border-yellow"
              : ""
          }`}
        >
          <span
            className={`font-headline font-black text-3xl md:text-4xl leading-none ${
              i === units.length - 1 ? "text-yellow" : "text-on-surface"
            }`}
          >
            {String(value).padStart(2, "0")}
          </span>
          <span
            className={`font-body text-[9px] uppercase tracking-widest mt-1 ${
              i === units.length - 1 ? "text-yellow" : "text-on-surface-muted"
            }`}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
