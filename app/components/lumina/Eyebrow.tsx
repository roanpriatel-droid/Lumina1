import type {CSSProperties, ReactNode} from 'react';

interface EyebrowProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Eyebrow({children, className = '', style}: EyebrowProps) {
  return (
    <div className={`eyebrow ${className}`} style={style}>
      {children}
    </div>
  );
}
