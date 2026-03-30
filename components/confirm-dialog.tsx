"use client";

type ConfirmDialogProps = {
  cancelLabel: string;
  confirmLabel: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
};

export function ConfirmDialog({
  cancelLabel,
  confirmLabel,
  description,
  onCancel,
  onConfirm,
  title,
}: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-950/45 p-3 sm:items-center">
      <div className="card-surface safe-pb w-full max-w-sm rounded-[32px] p-5">
        <h3 className="text-xl font-bold text-[var(--color-text)]">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-[var(--color-text-soft)]">
          {description}
        </p>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex min-h-12 flex-1 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-white px-4 font-semibold text-[var(--color-text)]"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex min-h-12 flex-1 items-center justify-center rounded-2xl bg-[var(--color-danger)] px-4 font-semibold text-white"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
