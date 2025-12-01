import { useState, useRef } from 'react';
import { EventType } from '@/data/eventTypes';
import { GlitterEffect } from './GlitterEffect';
import { Check, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import './animations.css';

interface EventCardProps {
  event: EventType;
  isSelected: boolean;
  onClick: () => void;
  language: 'es' | 'en';
}

export function EventCard({ event, isSelected, onClick, language }: EventCardProps) {
  const [showGlitter, setShowGlitter] = useState(false);
  const [glitterOrigin, setGlitterOrigin] = useState({ x: 0, y: 0 });
  const [isPulsing, setIsPulsing] = useState(false);
  const cardRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    if (!isSelected) {
      const rect = cardRef.current?.getBoundingClientRect();
      if (rect) {
        setGlitterOrigin({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
        setShowGlitter(true);
        setIsPulsing(true);
        setTimeout(() => setIsPulsing(false), 150);
      }
    }
    onClick();
  };

  const title = language === 'es' ? event.title : event.titleEn;
  const microCopy = language === 'es' ? event.microCopy : event.microCopyEn;
  const gamification = language === 'es' ? event.gamification : event.gamificationEn;

  return (
    <>
      <button
        ref={cardRef}
        onClick={handleClick}
        className={cn(
          "w-full p-5 rounded-2xl border-2 text-left transition-all duration-200 relative overflow-hidden",
          "hover:shadow-lg hover:-translate-y-0.5",
          isPulsing && "card-pulse",
          isSelected
            ? "shadow-lg"
            : "border-gray-100 bg-white hover:border-gray-200"
        )}
        style={{
          backgroundColor: isSelected ? event.secondaryColor : '#fcfcf9',
          borderColor: isSelected ? event.primaryColor : undefined,
          boxShadow: isSelected ? `0 8px 25px -5px ${event.primaryColor}40, 0 4px 10px -5px ${event.primaryColor}30` : undefined,
        }}
      >
        <div className="flex gap-4">
          <div
            className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 overflow-hidden",
              isSelected ? "shadow-lg scale-105" : "shadow-md"
            )}
            style={{ 
              boxShadow: isSelected ? `0 8px 20px -4px ${event.primaryColor}50` : undefined
            }}
          >
            <img 
              src={event.image} 
              alt={title}
              className={cn(
                "w-full h-full object-cover transition-transform duration-300",
                isSelected && "scale-110"
              )}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-[#1A3E5C] text-lg">{title}</h3>
              <div
                className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                  isSelected
                    ? "border-transparent"
                    : "border-gray-300 bg-white"
                )}
                style={{
                  backgroundColor: isSelected ? event.primaryColor : undefined,
                  borderColor: isSelected ? event.primaryColor : undefined,
                }}
              >
                {isSelected && (
                  <Check className="w-4 h-4 text-white checkmark-pop" />
                )}
              </div>
            </div>

            <p className="text-sm text-gray-600 leading-snug mb-2">
              {microCopy}
            </p>

            <div 
              className="flex items-center gap-1.5 text-sm font-semibold"
              style={{ color: event.primaryColor }}
            >
              <Lightbulb className="w-4 h-4" />
              <span>{gamification}</span>
            </div>
          </div>
        </div>

        {isSelected && (
          <div
            className="absolute inset-0 pointer-events-none opacity-15"
            style={{
              background: `radial-gradient(circle at 20% 40%, ${event.primaryColor} 0%, transparent 60%)`,
            }}
          />
        )}
      </button>

      <GlitterEffect
        trigger={showGlitter}
        originX={glitterOrigin.x}
        originY={glitterOrigin.y}
        color={event.primaryColor}
        onComplete={() => setShowGlitter(false)}
      />
    </>
  );
}
