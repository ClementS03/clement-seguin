"use client";

export function CalButton({ label, className }: { label: string; className?: string }) {
  return (
    <button
      data-cal-link="clement-seguin/strategy-call-30-min"
      data-cal-config='{"layout":"month_view"}'
      className={className}
    >
      {label}
    </button>
  );
}
