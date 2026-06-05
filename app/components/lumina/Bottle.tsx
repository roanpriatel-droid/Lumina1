interface BottleProps {
  width?: number;
  glow?: boolean;
  label?: boolean;
  className?: string;
}

// TODO(real-photography): replace this CSS placeholder with a real product
// shot. Drop the image into app/assets and swap the <Bottle> usages in
// Hero / ProductPair / Gallery for an <Image /> wrapped in the same glow.
export function Bottle({
  width = 150,
  glow = true,
  label = true,
  className = '',
}: BottleProps) {
  const height = width * 2.35;
  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{width, height}}
      aria-hidden
    >
      {glow && (
        <div
          className="pointer-events-none absolute"
          style={{
            width: width * 3.6,
            height: width * 3.6,
            background: 'var(--glow-hero)',
            left: '50%',
            top: '54%',
            transform: 'translate(-50%,-50%)',
          }}
        />
      )}
      <div
        className="relative"
        style={{
          width,
          height,
          borderRadius: `${width * 0.13}px ${width * 0.13}px ${width * 0.1}px ${width * 0.1}px`,
          background: 'linear-gradient(180deg,#232327,#0d0d0f)',
          border: '1px solid var(--color-border-strong)',
          boxShadow:
            'var(--shadow-lg), inset 0 1px 0 rgba(255,255,255,.06)',
        }}
      >
        {/* cap */}
        <div
          className="absolute"
          style={{
            top: -width * 0.16,
            left: '50%',
            transform: 'translateX(-50%)',
            width: width * 0.5,
            height: width * 0.2,
            borderRadius: `${width * 0.06}px ${width * 0.06}px 3px 3px`,
            background: '#0a0a0b',
            border: '1px solid var(--color-border-strong)',
          }}
        />
        {/* label */}
        <div
          className="absolute flex flex-col items-center justify-center"
          style={{
            left: '9%',
            right: '9%',
            top: '30%',
            bottom: '11%',
            borderRadius: width * 0.07,
            background: 'linear-gradient(180deg,#161618,#101012)',
            border: '1px solid var(--color-border)',
            gap: width * 0.05,
          }}
        >
          {label && (
            <>
              <span
                style={{
                  font: `300 ${width * 0.085}px/1 var(--font-sans)`,
                  letterSpacing: '0.3em',
                  color: 'var(--color-fg2)',
                }}
              >
                LUMINA
              </span>
              <span
                style={{
                  width: width * 0.035,
                  height: width * 0.035,
                  borderRadius: '50%',
                  background: 'var(--color-crimson)',
                  boxShadow: '0 0 5px 1px rgba(209,26,42,.9)',
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
