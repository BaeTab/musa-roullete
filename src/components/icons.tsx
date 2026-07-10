import type { ReactNode } from 'react';

interface IconProps {
  size?: number;
  className?: string;
}

function Icon({ size = 24, className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function ChevronRight(props: IconProps) {
  return (
    <Icon {...props}>
      <polyline points="9 6 15 12 9 18" />
    </Icon>
  );
}

export function ChevronLeft(props: IconProps) {
  return (
    <Icon {...props}>
      <polyline points="15 6 9 12 15 18" />
    </Icon>
  );
}

export function Star(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 3.2l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z" />
    </Icon>
  );
}

export function StarFilled({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 3.2l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z" />
    </svg>
  );
}

export function Share(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.6" y1="10.6" x2="15.4" y2="6.4" />
      <line x1="8.6" y1="13.4" x2="15.4" y2="17.6" />
    </Icon>
  );
}

export function Download(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 3v12" />
      <polyline points="7 10 12 15 17 10" />
      <path d="M5 20h14" />
    </Icon>
  );
}

export function Trophy(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M7 4h10v4a5 5 0 0 1-10 0V4z" />
      <path d="M7 5H4v1.5A3.5 3.5 0 0 0 7.5 10" />
      <path d="M17 5h3v1.5A3.5 3.5 0 0 1 16.5 10" />
      <line x1="12" y1="13" x2="12" y2="17" />
      <line x1="8" y1="20.5" x2="16" y2="20.5" />
      <line x1="10" y1="20.5" x2="10" y2="17" />
      <line x1="14" y1="20.5" x2="14" y2="17" />
    </Icon>
  );
}

export function Clock(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15.5 14" />
    </Icon>
  );
}

export function Users(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
      <path d="M16 5.2a3.2 3.2 0 0 1 0 6" />
      <path d="M17.5 14.4A5.5 5.5 0 0 1 20.5 20" />
    </Icon>
  );
}

export function Refresh(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M21 12a9 9 0 1 1-2.64-6.36L21 8" />
      <polyline points="21 3 21 8 16 8" />
    </Icon>
  );
}

export function Home(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 10.5 12 4l8 6.5" />
      <path d="M6 9.5V20h12V9.5" />
      <path d="M10 20v-5h4v5" />
    </Icon>
  );
}

export function LinkIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M9 15l6-6" />
      <path d="M11 6.5l1.4-1.4a4 4 0 0 1 5.7 5.7L16.5 12" />
      <path d="M13 17.5l-1.4 1.4a4 4 0 0 1-5.7-5.7L7.5 12" />
    </Icon>
  );
}

export function Dice(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <circle cx="9" cy="9" r="1.05" fill="currentColor" stroke="none" />
      <circle cx="15" cy="15" r="1.05" fill="currentColor" stroke="none" />
    </Icon>
  );
}

export function Check(props: IconProps) {
  return (
    <Icon {...props}>
      <polyline points="5 12.5 10 17.5 19 6.5" />
    </Icon>
  );
}

export function Plus(props: IconProps) {
  return (
    <Icon {...props}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </Icon>
  );
}

export function Trash(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 7h16" />
      <path d="M9 7V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V7" />
      <path d="M6 7l1 13a2 2 0 0 0 2 1.8h6a2 2 0 0 0 2-1.8L18 7" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </Icon>
  );
}

export function Receipt(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 3h12v17l-2-1.3-2 1.3-2-1.3-2 1.3-2-1.3-2 1.3V3z" />
      <line x1="8.5" y1="8" x2="15.5" y2="8" />
      <line x1="8.5" y1="12" x2="15.5" y2="12" />
    </Icon>
  );
}
