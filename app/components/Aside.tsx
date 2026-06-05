import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
  useId,
} from 'react';
import {X} from 'lucide-react';

type AsideType = 'search' | 'cart' | 'mobile' | 'closed';
type AsideContextValue = {
  type: AsideType;
  open: (mode: AsideType) => void;
  close: () => void;
};

/**
 * Right-side slide-in panel with backdrop overlay. Used for cart, search,
 * and mobile menu. Styling matches the Lumina cart drawer (surface bg,
 * hairline border-left, blurred overlay).
 */
export function Aside({
  children,
  heading,
  type,
}: {
  children?: React.ReactNode;
  type: AsideType;
  heading: React.ReactNode;
}) {
  const {type: activeType, close} = useAside();
  const expanded = type === activeType;
  const id = useId();

  useEffect(() => {
    const abortController = new AbortController();
    if (expanded) {
      document.addEventListener(
        'keydown',
        function handler(event: KeyboardEvent) {
          if (event.key === 'Escape') close();
        },
        {signal: abortController.signal},
      );
      // lock body scroll while open
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
    }
    return () => {
      abortController.abort();
      document.documentElement.style.overflow = '';
    };
  }, [close, expanded]);

  return (
    <div aria-modal role="dialog" aria-labelledby={id} aria-hidden={!expanded}>
      {/* Backdrop */}
      <button
        type="button"
        onClick={close}
        aria-label="Close panel"
        tabIndex={expanded ? 0 : -1}
        className="fixed inset-0 z-50 cursor-default border-0 bg-black/55 transition-opacity duration-200"
        style={{
          opacity: expanded ? 1 : 0,
          pointerEvents: expanded ? 'auto' : 'none',
        }}
      />
      {/* Panel */}
      <aside
        className="fixed right-0 top-0 z-[60] flex h-full w-[min(400px,92vw)] flex-col border-l border-border bg-surface transition-transform duration-300 ease-[cubic-bezier(.4,0,.2,1)]"
        style={{
          transform: expanded ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        <header className="flex h-[68px] flex-none items-center justify-between border-b border-border px-6">
          <h3
            id={id}
            className="text-base font-medium tracking-[0.04em] text-fg1"
          >
            {heading}
          </h3>
          <button
            onClick={close}
            aria-label="Close"
            className="inline-flex items-center justify-center p-1 text-fg2 transition-colors hover:text-fg1"
          >
            <X size={22} strokeWidth={2} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </aside>
    </div>
  );
}

const AsideContext = createContext<AsideContextValue | null>(null);

Aside.Provider = function AsideProvider({children}: {children: ReactNode}) {
  const [type, setType] = useState<AsideType>('closed');

  return (
    <AsideContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </AsideContext.Provider>
  );
};

export function useAside() {
  const aside = useContext(AsideContext);
  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return aside;
}
