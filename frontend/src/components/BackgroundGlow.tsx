import React from 'react';

export const BackgroundGlow: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 select-none">
      {/* Delicate architectural dot grid with very soft opacity */}
      <div className="absolute inset-0 bg-architectural-dots text-neutral-900/4 dark:text-neutral-100/5 [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_90%)]" />

      {/* Gentle center-top ambient warmth (editorial paper gradient) */}
      <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-to-b from-amber-600/[0.04] via-amber-500/[0.015] to-transparent dark:from-amber-400/[0.03] dark:via-transparent dark:to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Fine top border highlight line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-700/20 dark:via-amber-400/20 to-transparent" />
    </div>
  );
};