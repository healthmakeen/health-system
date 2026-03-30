function getRequiredEnv(name: "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY" | "NEXT_PUBLIC_SUPABASE_URL") {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      "Missing Supabase environment variables. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
  }

  return value;
}

const supabaseUrl = getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL");
const supabasePublishableKey = getRequiredEnv(
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
);

export { supabasePublishableKey, supabaseUrl };
