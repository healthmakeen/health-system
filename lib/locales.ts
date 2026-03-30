import arMessages from "@/messages/ar";
import enMessages from "@/messages/en";
import trMessages from "@/messages/tr";
import type { Direction, Locale } from "@/types/app";

export const locales: Locale[] = ["en", "ar", "tr"];
export const defaultLocale: Locale = "en";

export const localeDirection: Record<Locale, Direction> = {
  ar: "rtl",
  en: "ltr",
  tr: "ltr",
};

type MessageShape<T> = {
  [Key in keyof T]: T[Key] extends string ? string : MessageShape<T[Key]>;
};

export type Messages = MessageShape<typeof enMessages>;

const dictionaries: Record<Locale, Messages> = {
  ar: arMessages,
  en: enMessages,
  tr: trMessages,
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getMessages(locale: Locale): Messages {
  return dictionaries[locale];
}

export function getDirection(locale: Locale): Direction {
  return localeDirection[locale];
}

export function translate(messages: Messages, key: string): string {
  const value = key.split(".").reduce<unknown>((currentValue, segment) => {
    if (
      typeof currentValue === "object" &&
      currentValue !== null &&
      segment in currentValue
    ) {
      return currentValue[segment as keyof typeof currentValue];
    }

    return undefined;
  }, messages);

  return typeof value === "string" ? value : key;
}

export function getLocalizedPath(locale: Locale, path = ""): string {
  if (!path || path === "/") {
    return `/${locale}`;
  }

  return `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
}

export function replaceLocaleInPath(pathname: string, locale: Locale): string {
  const segments = pathname.split("/");

  if (segments[1] && isLocale(segments[1])) {
    segments[1] = locale;
    return segments.join("/") || `/${locale}`;
  }

  return getLocalizedPath(locale, pathname);
}

export function getWeekdayKey(dateValue: string): keyof Messages["weekdays"] {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    weekday: "long",
  })
    .format(new Date(`${dateValue}T00:00:00Z`))
    .toLowerCase();

  return weekday as keyof Messages["weekdays"];
}

export function formatDate(dateValue: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${dateValue}T00:00:00`));
}

export function formatDateTime(dateValue: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateValue));
}

export function formatLongDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "full",
  }).format(date);
}
