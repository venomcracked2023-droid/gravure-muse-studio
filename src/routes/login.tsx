import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { LogIn } from "lucide-react";
import { SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => {
    const title = "Đăng nhập hoặc đăng ký — GravureHub";
    const desc = "Đăng nhập GravureHub bằng email để theo dõi người mẫu yêu thích, đánh giá album và đăng nội dung mới.";
    const url = `${SITE_URL}/login`;
    return {
      meta: [
        { title }, { name: "description", content: desc },
        { name: "robots", content: "noindex,follow" },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
});

function LoginPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (!loading && user) navigate({ to: "/" }); }, [user, loading, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin, data: { full_name: name } },
        });
        if (error) throw error;
        toast.success("Đã tạo tài khoản. Kiểm tra email để xác thực.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Đăng nhập thành công");
        navigate({ to: "/" });
      }
    } catch (e: any) { toast.error(e.message ?? "Lỗi"); } finally { setBusy(false); }
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-md px-4 py-12">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">
          <h1 className="text-2xl font-bold tracking-tight">{mode === "signin" ? "Đăng nhập" : "Tạo tài khoản"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "signin" ? "Đăng nhập để ngắm, theo dõi và đăng ảnh." : "Tham gia GravureHub trong vài giây."}
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-3">
            {mode === "signup" && (
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên hiển thị"
                className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm outline-none focus:border-ring" />
            )}
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
              className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm outline-none focus:border-ring" />
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mật khẩu"
              className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm outline-none focus:border-ring" />
            <button type="submit" disabled={busy}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50">
              <LogIn className="h-4 w-4" />{mode === "signin" ? "Đăng nhập" : "Tạo tài khoản"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            {mode === "signin" ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
            <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="text-primary hover:underline">
              {mode === "signin" ? "Đăng ký" : "Đăng nhập"}
            </button>
          </p>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Muốn đăng ảnh? <Link to="/apply" className="text-primary hover:underline">Ứng tuyển cộng tác viên</Link>
        </p>
      </main>
    </div>
  );
}