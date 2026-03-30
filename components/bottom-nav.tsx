"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { signOutAction } from "@/app/[locale]/actions";
import { SubmitButton } from "@/components/submit-button";
import { useLocaleContext } from "@/components/locale-provider";
import { cn } from "@/lib/utils";

const iconClassName = "h-5 w-5";

export function BottomNav() {
  const pathname = usePathname();
  const { locale, t } = useLocaleContext();

  const navItems = [
    {
      href: `/${locale}/dashboard`,
      icon: <HomeIcon />,
      label: t("nav.home"),
      match: `/${locale}/dashboard`,
    },
    {
      href: `/${locale}/reports`,
      icon: <ReportsIcon />,
      label: t("nav.reports"),
      match: `/${locale}/reports`,
    },
    {
      href: `/${locale}/settings`,
      icon: <ProfileIcon />,
      label: t("nav.profile"),
      match: `/${locale}/settings`,
    },
  ];

  return (
    <div className="safe-px safe-pb pointer-events-none fixed inset-x-0 bottom-0 z-30 mx-auto flex w-full max-w-md pb-4">
      <nav className="pointer-events-auto card-surface grid w-full grid-cols-4 rounded-[28px] px-2 py-2 backdrop-blur-sm">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.match}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center rounded-2xl px-2 text-center text-[11px] font-semibold transition",
                active
                  ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                  : "text-[var(--color-text-soft)] hover:bg-[var(--color-surface-strong)]",
              )}
            >
              {item.icon}
              <span className="mt-1 leading-none">{item.label}</span>
            </Link>
          );
        })}

        <form action={signOutAction} className="contents">
          <input type="hidden" name="locale" value={locale} />
          <SubmitButton
            variant="secondary"
            className="flex min-h-14 flex-col items-center justify-center rounded-2xl px-2 text-center text-[11px] font-semibold text-[var(--color-text-soft)] shadow-none ring-0 hover:bg-[var(--color-surface-strong)]"
            pendingLabel={t("common.loading")}
          >
            <span className="flex flex-col items-center justify-center">
              <LogoutIcon />
              <span className="mt-1 leading-none">{t("nav.logout")}</span>
            </span>
          </SubmitButton>
        </form>
      </nav>
    </div>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={iconClassName} aria-hidden="true">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V20h13V9.5" />
    </svg>
  );
}

function ReportsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={iconClassName} aria-hidden="true">
      <path d="M5 19V9" />
      <path d="M12 19V5" />
      <path d="M19 19v-7" />
      <path d="M4 19h16" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={iconClassName} aria-hidden="true">
      <path d="M19 20a7 7 0 0 0-14 0" />
      <circle cx="12" cy="8" r="4" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={iconClassName} aria-hidden="true">
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H4" />
      <path d="M20 4v16" />
    </svg>
  );
}
