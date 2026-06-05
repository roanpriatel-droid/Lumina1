import {forwardRef, type ButtonHTMLAttributes, type ReactNode} from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  full?: boolean;
  children: ReactNode;
}

const base =
  'inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-pill px-7 py-4 text-[15px] font-medium leading-none tracking-[0.01em] transition-[background,transform,box-shadow,color] duration-150 ease-out disabled:cursor-not-allowed disabled:opacity-50';

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-crimson text-white shadow-accent hover:bg-crimson-hi active:bg-crimson-lo active:translate-y-px active:shadow-none',
  secondary:
    'border border-border-strong bg-transparent text-fg1 hover:border-fg3',
  ghost: 'bg-surface-2 text-fg1 hover:bg-[#222226]',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {variant = 'primary', full = false, className = '', children, ...rest},
    ref,
  ) {
    return (
      <button
        ref={ref}
        className={`${base} ${variantClasses[variant]} ${full ? 'w-full' : ''} ${className}`}
        {...rest}
      >
        {children}
      </button>
    );
  },
);
