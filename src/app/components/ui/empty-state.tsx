import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
};

export default function EmptyState({
  icon: Icon = Sparkles,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-current/20 px-6 py-12 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-amber-400/15 text-amber-500">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <div>
        <p className="text-lg font-semibold">{title}</p>
        <p className="mx-auto mt-1 max-w-md text-sm leading-relaxed opacity-70">
          {description}
        </p>
      </div>
      {actionLabel && actionHref ? (
        <Link
          href={actionHref}
          className="rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-amber-300"
        >
          {actionLabel}
        </Link>
      ) : null}
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-amber-300"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
