import {forwardRef, type ButtonHTMLAttributes, type ReactNode} from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  full?: boolean;
  children: ReactNode;
}

/**
 * The brand's only button system.
 *
 *  - primary: crimson with a 1px-inset top highlight + ambient
 *    rgba(209,26,42,0.25) shadow. Hover brightens 8% and the shadow
 *    deepens. Active drops 1px.
 *  - secondary: transparent, 1px #2A2A2E border, hover → crimson border
 *    with a faint crimson tint.
 *  - ghost: kept for compatibility with the cart sticky bar; behaves
 *    like secondary visually now so we don't accidentally introduce a
 *    third button style anywhere on the site.
 */
const variantClasses: Record<Variant, string> = {
  primary: 'lumina-btn lumina-btn-primary',
  secondary: 'lumina-btn lumina-btn-secondary',
  ghost: 'lumina-btn lumina-btn-secondary',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {variant = 'primary', full = false, className = '', children, ...rest},
    ref,
  ) {
    return (
      <button
        ref={ref}
        className={`${variantClasses[variant]} ${full ? 'w-full' : ''} ${className}`}
        {...rest}
      >
        {children}
      </button>
    );
  },
);
