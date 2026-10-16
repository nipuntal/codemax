// Hand-drawn 20×20 stroke icons; inherit colour from currentColor.
import type { JSX } from 'preact';

const I = (d: JSX.Element) => (p: { size?: number }) => (
  <svg width={p.size ?? 18} height={p.size ?? 18} viewBox="0 0 20 20" fill="none" stroke="currentColor"
    stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{d}</svg>
);

export const Sidebar = I(<><rect x="2.5" y="3.5" width="15" height="13" rx="3" /><path d="M7.5 3.5v13M4.5 7h1M4.5 9.5h1" /></>);
export const Play = I(<path d="M6.5 4.5v11l9-5.5z" />);
export const Check = I(<path d="M4 10.5l4 4 8-9" />);
export const Reset = I(<><path d="M4 10a6 6 0 1 0 1.8-4.3" /><path d="M4 3.5v3h3" /></>);
export const Bulb = I(<><path d="M7.5 14.5h5M8.5 17h3" /><path d="M10 3a5 5 0 0 0-3 9c.6.5 1 1.1 1 1.8v.7h4v-.7c0-.7.4-1.3 1-1.8A5 5 0 0 0 10 3z" /></>);
export const Chevron = I(<path d="M8 6l4 4-4 4" />);
export const Back = I(<path d="M12 5l-5 5 5 5" />);
export const Tray = I(<><path d="M3 11.5l2-7h10l2 7v4H3z" /><path d="M3 11.5h4l1 2h4l1-2h4" /></>);
export const Terminal = I(<><rect x="2.5" y="3.5" width="15" height="13" rx="2.5" /><path d="M6 8l2.5 2L6 12M10.5 12.5H14" /></>);
export const Snake = I(<><path d="M7 3.5h4a2 2 0 0 1 2 2V9H8a2 2 0 0 0-2 2v1.5" /><path d="M13 16.5H9a2 2 0 0 1-2-2V11h5a2 2 0 0 0 2-2V7.5" /></>);
export const Db = I(<><ellipse cx="10" cy="5" rx="6" ry="2.5" /><path d="M4 5v10c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V5M4 10c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5" /></>);
export const Book = I(<><path d="M10 5.5c-1.5-1.3-3.5-2-6.5-2v11.5c3 0 5 .7 6.5 2 1.5-1.3 3.5-2 6.5-2V3.5c-3 0-5 .7-6.5 2z" /><path d="M10 5.5v11.5" /></>);
export const Lock = I(<><rect x="4.5" y="9" width="11" height="8" rx="2" /><path d="M7 9V6.5a3 3 0 0 1 6 0V9" /></>);
export const Pencil = I(<><path d="M12.5 4.5l3 3-8.5 8.5H4v-3z" /></>);
export const Close = I(<path d="M5.5 5.5l9 9M14.5 5.5l-9 9" />);
export const Panel = I(<><rect x="2.5" y="3.5" width="15" height="13" rx="3" /><path d="M2.5 12.5h15" /></>);
