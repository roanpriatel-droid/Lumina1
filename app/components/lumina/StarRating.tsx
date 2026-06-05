import {Star} from 'lucide-react';

interface StarRatingProps {
  size?: number;
  className?: string;
  label?: string;
}

export function StarRating({size = 16, className = '', label}: StarRatingProps) {
  return (
    <span
      className={`inline-flex gap-[2px] text-crimson ${className}`}
      role="img"
      aria-label={label ?? '5 stars'}
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          size={size}
          strokeWidth={0}
          fill="currentColor"
          aria-hidden
        />
      ))}
    </span>
  );
}
