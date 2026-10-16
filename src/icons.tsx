// Hand-drawn 20×20 stroke icons; inherit colour from currentColor.
import type { JSX } from 'preact';

const I = (d: JSX.Element) => (p: { size?: number }) => (
  <svg width={p.size ?? 18} height={p.size ?? 18} viewBox="0 0 20 20" fill="none" stroke="currentColor"
    stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{d}</svg>
);

export const Play = I(<path d="M6.5 4.5v11l9-5.5z" />);
export const Stop = I(<rect x="5.5" y="5.5" width="9" height="9" rx="1.5" />);
export const Check = I(<path d="M4 10.5l4 4 8-9" />);
export const Reset = I(<><path d="M4 10a6 6 0 1 0 1.8-4.3" /><path d="M4 3.5v3h3" /></>);
export const Bulb = I(<><path d="M7.5 14.5h5M8.5 17h3" /><path d="M10 3a5 5 0 0 0-3 9c.6.5 1 1.1 1 1.8v.7h4v-.7c0-.7.4-1.3 1-1.8A5 5 0 0 0 10 3z" /></>);
export const Back = I(<path d="M12 5l-5 5 5 5" />);
export const Pencil = I(<><path d="M12.5 4.5l3 3-8.5 8.5H4v-3z" /></>);
export const Close = I(<path d="M5.5 5.5l9 9M14.5 5.5l-9 9" />);
