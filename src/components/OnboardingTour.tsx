/**
 * Onboarding Tour Component
 * Fix #06: Implement interactive onboarding tour for new users
 */

import React, { useState, useEffect } from 'react';
import Joyride, { Step, CallBackProps, STATUS, ACTIONS, EVENTS } from 'react-joyride';
import { useLanguage } from '@/contexts/LanguageContext';
import { analytics } from '@/lib/analytics';

const TOUR_COMPLETED_KEY = 'givlyn_tour_completed';

interface OnboardingTourProps {
  run?: boolean;
  onComplete?: () => void;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ run = true, onComplete }) => {
  const { t } = useLanguage();
  const [runTour, setRunTour] = useState(false);

  useEffect(() => {
    // Check if tour has been completed before
    const tourCompleted = localStorage.getItem(TOUR_COMPLETED_KEY);
    if (!tourCompleted && run) {
      // Small delay to ensure DOM is ready
      setTimeout(() => setRunTour(true), 500);
    }
  }, [run]);

  const steps: Step[] = [
    {
      target: 'body',
      title: t('tourWelcome') || '¡Bienvenido a Givlyn! 🎁',
      content: `${t('tourWelcomeMessage') || 'Compra más inteligente con comparaciones de precios y ofertas impulsadas por IA.'}\n\n${t('tourWelcomeSubtitle') || 'Te mostraremos en 4 pasos cómo ahorrar dinero.'}`,
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '[data-tour="quick-actions"]',
      title: t('tourActionsStep') || 'Acciones Rápidas',
      content: '📝 CREAR LISTA: Organiza regalos para cualquier ocasión\n🔍 BUSCAR OFERTAS: Encuentra el mejor precio en 5+ tiendas\n💰 GANAR CASHBACK: Acumula puntos en cada compra',
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="create-list"]',
      title: t('tourCreateListTitle') || 'Crea Tu Primera Lista',
      content: t('tourCreateListStep') || '¡Empieza aquí! Crea una lista para cumpleaños, bodas, o compras diarias. Comparte con amigos y coordina sin duplicados.',
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="stats-overview"]',
      title: t('tourStatsTitle') || 'Tu Resumen',
      content: t('tourStatsStep') || 'Aquí verás tu ahorro total, listas activas y próximos eventos. ¡Todo en un vistazo!',
      placement: 'bottom',
      disableBeacon: true,
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, action, type } = data;

    // Tour completed or skipped
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRunTour(false);
      localStorage.setItem(TOUR_COMPLETED_KEY, 'true');
      
      if (status === STATUS.FINISHED) {
        analytics.trackEvent('tutorial_complete');
      }
      
      onComplete?.();
    }

    // Track step changes
    if (type === EVENTS.STEP_AFTER && action === ACTIONS.NEXT) {
      const { trackEvent } = analytics;
      trackEvent('tour_step_completed', {
        step: data.index,
      });
    }
  };

  return (
    <Joyride
      steps={steps}
      run={runTour}
      continuous
      showProgress
      showSkipButton
      scrollToFirstStep
      scrollOffset={100}
      disableScrolling={false}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: 'hsl(var(--primary))',
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: 8,
          fontSize: 14,
        },
        buttonNext: {
          backgroundColor: 'hsl(var(--primary))',
          borderRadius: 6,
          padding: '8px 16px',
        },
        buttonBack: {
          color: 'hsl(var(--muted-foreground))',
        },
        buttonSkip: {
          color: 'hsl(var(--muted-foreground))',
        },
      }}
      locale={{
        back: t('back') || 'Atrás',
        close: t('close') || 'Cerrar',
        last: t('finish') || 'Finalizar',
        next: t('next') || 'Siguiente',
        skip: t('skip') || 'Saltar',
      }}
    />
  );
};

// Hook to restart tour
export const useRestartTour = () => {
  const restartTour = () => {
    localStorage.removeItem(TOUR_COMPLETED_KEY);
    window.location.reload();
  };

  return restartTour;
};
