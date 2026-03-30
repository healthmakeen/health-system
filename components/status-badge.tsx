import { getMessages, translate } from "@/lib/locales";
import { cn } from "@/lib/utils";
import type { Locale, OverallStatus } from "@/types/app";

type StatusBadgeProps = {
  locale: Locale;
  status: OverallStatus;
};

export function StatusBadge({ locale, status }: StatusBadgeProps) {
  const messages = getMessages(locale);

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
        `status-${status}`,
      )}
    >
      {status === "stable"
        ? translate(messages, "labels.statusStable")
        : translate(messages, "labels.statusNeedsAttention")}
    </span>
  );
}
