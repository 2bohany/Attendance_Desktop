import { cn } from '@/lib/utils';

const TONES = [
  'bg-primary-soft text-primary-soft-foreground',
  'bg-info-soft text-info',
  'bg-warning-soft text-warning',
  'bg-success-soft text-success',
  'bg-secondary text-secondary-foreground',
];

function initials(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || '?'
  );
}

/** Initials avatar; the tone is stable per name so people are easy to spot in long lists. */
export function EmployeeAvatar({ name, className }: { name: string; className?: string }) {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  const tone = TONES[Math.abs(hash) % TONES.length];

  return (
    <span
      aria-hidden
      className={cn(
        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
        tone,
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}
