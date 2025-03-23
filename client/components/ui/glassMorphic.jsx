import React from 'react';

// Simple className utility function to replace cn from utils
const combineClassNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

export const GlassCard = ({
  children,
  className,
  blur = "md",
  opacity = "20",
  ...props
}) => {
  return (
    <div
      className={combineClassNames(
        `rounded-2xl bg-white/[0.${opacity}] backdrop-blur-${blur} border border-white/30 shadow-lg transition-all duration-300`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const GlassButton = ({
  children,
  className,
  blur = "md",
  opacity = "20",
  ...props
}) => {
  return (
    <button
      className={combineClassNames(
        `px-6 py-3 rounded-full bg-white/[0.${opacity}] backdrop-blur-${blur} 
        border border-white/30 shadow-md hover:shadow-lg transition-all
        duration-300 hover:bg-white/30 active:scale-95`,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export const GlassInput = ({
  className,
  blur = "md",
  opacity = "10",
  ...props
}) => {
  return (
    <input
      className={combineClassNames(
        `px-4 py-3 rounded-lg bg-white/[0.${opacity}] backdrop-blur-${blur}
        border border-white/30 shadow-sm focus:outline-none
        focus:ring-2 focus:ring-altpay-500/50 focus:border-transparent
        transition-all duration-300 w-full`,
        className
      )}
      {...props}
    />
  );
};

export const GlassPanel = ({
  children,
  className,
  blur = "md",
  opacity = "10",
  ...props
}) => {
  return (
    <div
      className={combineClassNames(
        `rounded-3xl bg-white/[0.${opacity}] backdrop-blur-${blur}
        border border-white/20 shadow-xl`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};