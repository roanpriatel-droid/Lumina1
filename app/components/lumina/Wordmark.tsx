interface WordmarkProps {
  size?: number;
  tm?: boolean;
  className?: string;
}

export function Wordmark({size = 22, tm = false, className = ''}: WordmarkProps) {
  return (
    <span
      className={`inline-flex items-start ${className}`}
      aria-label="Lumina"
    >
      <span
        style={{
          font: `300 ${size}px/1 var(--font-sans)`,
          letterSpacing: '0.40em',
          textTransform: 'uppercase',
          color: 'var(--color-fg1)',
          paddingLeft: '0.40em',
        }}
      >
        LUMINA
      </span>
      <span
        aria-hidden
        style={{
          width: size * 0.28,
          height: size * 0.28,
          borderRadius: '50%',
          background: 'var(--color-crimson)',
          marginLeft: size * 0.14,
          marginTop: size * 0.18,
          boxShadow:
            '0 0 8px 1.5px rgba(209,26,42,.9), 0 0 18px 5px rgba(209,26,42,.45)',
          flex: 'none',
        }}
      />
      {tm && (
        <sup
          style={{
            font: '400 0.5em/1 var(--font-sans)',
            color: 'var(--color-fg3)',
            marginLeft: 2,
          }}
        >
          ™
        </sup>
      )}
    </span>
  );
}
