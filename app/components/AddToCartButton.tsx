import {type FetcherWithComponents} from 'react-router';
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';

const baseClass = 'lumina-btn lumina-btn-primary';

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
