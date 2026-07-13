import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

export const getHomeStats = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
  const [comicsRes, chaptersRes] = await Promise.all([
    supabase.from("comics").select("*", { count: "exact", head: true }),
    supabase.from("chapters").select("*", { count: "exact", head: true }),
  ]);
  return {
    models: comicsRes.count ?? 0,
    albums: chaptersRes.count ?? 0,
  };
});
