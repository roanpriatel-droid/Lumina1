interface StepNumberProps {
  n: number | string;
}

export function StepNumber({n}: StepNumberProps) {
  return (
    <span
      className="t-mono inline-flex h-[26px] w-[26px] flex-none items-center justify-center rounded-full border border-border-strong text-xs font-medium text-fg2"
      aria-hidden
    >
      {n}
    </span>
  );
}
