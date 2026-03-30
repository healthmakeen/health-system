"use client";

import { createContext, useContext } from "react";

import {
  getDirection,
  translate,
  type Messages,
} from "@/lib/locales";
import type { Direction, Locale } from "@/types/app";

type LocaleContextValue = {
  dir: Direction;
  locale: Locale;
  messages: Messages;
  t: (key: string) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

type LocaleProviderProps = {
  children: React.ReactNode;
  locale: Locale;
  messages: Messages;
};

export function LocaleProvider({
  children,
  locale,
  messages,
}: LocaleProviderProps) {
  return (
    <LocaleContext.Provider
      value={{
        dir: getDirection(locale),
        locale,
        messages,
        t: (key) => translate(messages, key),
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocaleContext() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useLocaleContext must be used within LocaleProvider.");
  }

  return context;
}
