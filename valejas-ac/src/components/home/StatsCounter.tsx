"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: 12,   suffix: "",  label: "Títulos Nacionais" },
  { value: 850,  suffix: "+", label: "Sócios Ativos" },
  { value: 6,    suffix: "",  label: "Modalidades" },
  { value: 1944, suffix: "",  label: "Ano de Fundação" },
];

export default function StatsCounter() {
  const sectionRef = useRef<HTMLElement>(null);
  const numRefs    = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      numRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          { val: 0 },
          { val: STATS[i].value },
          {
            duration: 1.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              once: true,
            },
            onUpdate() {
              const self = this as { val: number };
              if (el) el.textContent = Math.round(self.val).toLocaleString("pt-PT");
            },
          }
        );
      });

      // Section entrance
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          duration: 0.7,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-surface-mid">
      <div className="section-container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x divide-on-surface/10">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="text-center px-6">
              <div className="stat-number">
                <span ref={(el) => { numRefs.current[i] = el; }}>0</span>
                {stat.suffix}
              </div>
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
