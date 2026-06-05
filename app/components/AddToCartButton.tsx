import {type FetcherWithComponents} from 'react-router';
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';

const baseClass =
  'inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-pill px-7 py-4 text-[15px] font-medium leading-none tracking-[0.01em] transition-[background,transform,box-shadow] duration-150 ease-out bg-crimson text-white shadow-accent hover:bg-crimson-hi active:bg-crimson-lo active:translate-y-px active:shadow-none disabled:cursor-not-allowed disabled:opacity-50';

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
  className = '',
  fullWidth = false,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: () => void;
  className?: string;
  fullWidth?: boolean;
}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <button
            type="submit"
            onClick={onClick}
            disabled={disabled ?? fetcher.state !== 'idle'}
            className={`${baseClass} ${fullWidth ? 'w-full' : ''} ${className}`}
          >
            {children}
          </button>
        </>
      )}
    </CartForm>
  );
}
