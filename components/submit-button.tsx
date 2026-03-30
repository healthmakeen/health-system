"use client";

import { useFormStatus } from "react-dom";

import { cn } from "@/lib/utils";

type SubmitButtonProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  pendingLabel?: string;
  type?: "button" | "submit";
  variant?: "primary" | "secondary";
};

export function SubmitButton({
  children,
  className,
  onClick,
  pendingLabel,
  type = "submit",
  variant = "primary",
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={pending}
      className={cn(
        "min-h-13 rounded-2xl px-5 text-base font-semibold transition disabled:opacity-60",
        variant === "primary"
          ? "bg-[var(--color-primary)] !text-white hover:bg-[var(--color-primary-strong)]"
          : "bg-white !text-[var(--color-text)] ring-1 ring-[var(--color-border)] hover:bg-[var(--color-surface-strong)]",
        className,
      )}
    >
      {pending ? pendingLabel ?? children : children}
    </button>
  );
}
