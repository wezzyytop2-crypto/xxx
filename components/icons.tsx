import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function BaseIcon({ children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      {children}
    </svg>
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V21h13V9.5" />
    </BaseIcon>
  );
}

export function BrainIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M9.5 5.5A3.5 3.5 0 0 1 16 7v.4A3.1 3.1 0 0 1 18.5 10a3 3 0 0 1-2 2.8V14a3 3 0 0 1-3 3h-1" />
      <path d="M8 17H7a3.5 3.5 0 0 1-3.5-3.5 3.4 3.4 0 0 1 1.8-3A3.6 3.6 0 0 1 5 9a3.5 3.5 0 0 1 3.5-3.5H10" />
      <path d="M9 5.5V19" />
    </BaseIcon>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </BaseIcon>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </BaseIcon>
  );
}

export function VolumeIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M5 9v6h3l4 4V5L8 9H5Z" />
      <path d="M16 9.5a4 4 0 0 1 0 5" />
      <path d="M18.5 7a7.2 7.2 0 0 1 0 10" />
    </BaseIcon>
  );
}

export function EditIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M12 20H5a1 1 0 0 1-1-1v-7" />
      <path d="m16.5 4.5 3 3L10 17H7v-3l9.5-9.5Z" />
    </BaseIcon>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="m7 7 1 13h8l1-13" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
    </BaseIcon>
  );
}

export function RefreshIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M20 7v5h-5" />
      <path d="M4 17v-5h5" />
      <path d="M17 12a5 5 0 0 0-8.5-3.5L6 12" />
      <path d="M7 12a5 5 0 0 0 8.5 3.5L18 12" />
    </BaseIcon>
  );
}

export function DeckIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M4 8.5 12 4l8 4.5-8 4.5-8-4.5Z" />
      <path d="M4 12.5 12 17l8-4.5" />
      <path d="M4 16.5 12 21l8-4.5" />
    </BaseIcon>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="m5 12 4 4L19 6" />
    </BaseIcon>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M6 6 18 18" />
      <path d="M18 6 6 18" />
    </BaseIcon>
  );
}

export function PenIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="m18.5 5.5-10 10L5 19l3.5-3.5 10-10 0-0Z" />
      <path d="M13 6l5 5" />
    </BaseIcon>
  );
}

export function BookIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v17H7.5A2.5 2.5 0 0 0 5 22Z" />
      <path d="M5 5.5V22" />
      <path d="M8.5 7H16" />
      <path d="M8.5 11H16" />
    </BaseIcon>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="m9 6 6 6-6 6" />
    </BaseIcon>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5v5l3 2" />
    </BaseIcon>
  );
}

export function ChartIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M5 19V9" />
      <path d="M12 19V5" />
      <path d="M19 19v-7" />
      <path d="M4 19h16" />
    </BaseIcon>
  );
}

export function DownloadIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M12 4v10" />
      <path d="m8 10 4 4 4-4" />
      <path d="M4 20h16" />
    </BaseIcon>
  );
}

export function SignalIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M4.5 16.5a10.5 10.5 0 0 1 15 0" />
      <path d="M7.5 13.5a6.4 6.4 0 0 1 9 0" />
      <path d="M10.5 10.5a2.4 2.4 0 0 1 3 0" />
      <circle cx="12" cy="18" r="1" fill="currentColor" stroke="none" />
    </BaseIcon>
  );
}

export function OfflineIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M4.5 16.5a10.5 10.5 0 0 1 15 0" />
      <path d="M7.5 13.5a6.4 6.4 0 0 1 9 0" />
      <path d="M10.5 10.5a2.4 2.4 0 0 1 3 0" />
      <path d="M4 4 20 20" />
    </BaseIcon>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </BaseIcon>
  );
}
