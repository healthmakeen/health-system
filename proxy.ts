import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { defaultLocale, isLocale } from "@/lib/locales";
import { updateSession } from "@/lib/supabase/middleware";

function hasLocalePrefix(pathname: string) {
  const segments = pathname.split("/");
  return isLocale(segments[1] ?? "");
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!hasLocalePrefix(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname =
      pathname === "/" ? `/${defaultLocale}` : `/${defaultLocale}${pathname}`;
    return NextResponse.redirect(url);
  }

  return updateSession(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
