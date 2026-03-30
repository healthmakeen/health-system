"use client";

import { useFormStatus } from "react-dom";

import { cn } from "@/lib/utils";

type SubmitButtonProps = {
  children: React.ReactNode;
  className?: string;
  pendingLabel?: string;
};

export function SubmitButton({
  children,
  className,
  pendingLabel,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "min-h-13 rounded-2xl bg-[var(--color-primary)] px-5 text-base font-semibold !text-white transition hover:bg-[var(--color-primary-strong)] disabled:opacity-60",
        className,
      )}
    >
      {pending ? pendingLabel ?? children : children}
    </button>
  );
}
