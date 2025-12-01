import { useEffect, useState } from 'react';

interface Particle {
  id: string;
  x: number;
  y: number;
  tx: number;
  ty: number;
  color: string;
}

interface GlitterEffectProps {
  trigger: boolean;
  originX: number;
  originY: number;
  color?: string;
  onComplete?: () => void;
}

export function GlitterEffect({ trigger, originX, originY, color = '#22C55E', onComplete }: GlitterEffectProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (trigger && originX && originY) {
      const newParticles: Particle[] = [];
      const particleCount = 8;
      
      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        const distance = 40 + Math.random() * 20;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        newParticles.push({
          id: `${Date.now()}-${i}`,
          x: originX,
          y: originY,
          tx,
          ty,
          color,
        });
      }

      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [trigger, originX, originY, color, onComplete]);

  if (particles.length === 0) return null;

  return (
    <>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="glitter-particle"
          style={{
            position: 'fixed',
            left: particle.x,
            top: particle.y,
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: particle.color,
            pointerEvents: 'none',
            zIndex: 9999,
            animation: 'glitterFly 400ms ease-out forwards',
            ['--tx' as string]: `${particle.tx}px`,
            ['--ty' as string]: `${particle.ty}px`,
          }}
        />
      ))}
    </>
  );
}
