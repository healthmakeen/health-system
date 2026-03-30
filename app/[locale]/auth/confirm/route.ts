import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { EmailOtpType } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { isLocale } from "@/lib/locales";
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/env";
import type { Database } from "@/types/database";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ locale: string }> },
) {
  const { locale } = await context.params;

  if (!isLocale(locale)) {
    return NextResponse.redirect(new URL("/en/login", request.url));
  }

  const requestUrl = new URL(request.url);
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type") as EmailOtpType | null;
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";

  const redirectUrl = new URL(`/${locale}${next}`, request.url);

  if (!tokenHash || !type) {
    redirectUrl.pathname = `/${locale}/login`;
    redirectUrl.searchParams.set("error", "missing_token");
    return NextResponse.redirect(redirectUrl);
  }

  let response = NextResponse.redirect(redirectUrl);

  const supabase = createServerClient<Database>(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.redirect(redirectUrl);

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options as CookieOptions);
        });
      },
    },
  });

  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type,
  });

  if (error) {
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set("error", "invalid_token");
    return NextResponse.redirect(loginUrl);
  }

  return response;
}
