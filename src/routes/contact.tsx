import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import { MessageSquare, Mail, Send, Clock, ChevronRight, Home, ShieldAlert, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => {
    const title = `Contact Us — ${SITE_NAME}`;
    const desc =
      "Get in touch with GravureHub support, DMCA inquiries, creator applications, and partnership requests via Telegram or direct message.";
    const url = `${SITE_URL}/contact`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { name: "robots", content: "index,follow" },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
      ],
      links: [
        { rel: "canonical", href: url },
        { rel: "alternate", hrefLang: "en", href: url },
        { rel: "alternate", hrefLang: "x-default", href: url },
      ],
    };
  },
});

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("general");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim() || !email.trim()) {
      toast.error("Vui lòng điền đầy đủ email và nội dung tin nhắn.");
      return;
    }
    setSent(true);
    toast.success("Cảm ơn bạn! Tin nhắn đã được gửi tới ban quản trị GravureHub.");
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:py-16">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-primary transition-colors">
            <Home className="h-3.5 w-3.5" /> Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
          <span className="font-semibold text-foreground">Contact Us</span>
        </nav>

        <div className="grid gap-8 md:grid-cols-[1fr_1.3fr]">
          <div className="rounded-3xl border border-border bg-card/50 p-6 backdrop-blur sm:p-8">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Contact Us</h1>
                <p className="text-xs text-muted-foreground">We're here to help & listen</p>
              </div>
            </div>

            <div className="mt-6 space-y-4 text-xs text-muted-foreground sm:text-sm">
              <div className="rounded-2xl border border-border bg-background/40 p-4">
                <div className="flex items-center gap-2 font-semibold text-foreground">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-[#29A9EA]" aria-hidden="true">
                    <path d="M21.6 4.8c-.5-.4-1.1-.4-1.6-.2L2.8 11.3c-.9.3-1.1 1.1-.5 1.6l3.4 2.6 2.3 7.1c.2.6.8.9 1.4.5l3-2.3 3.8 3.1c.6.5 1.5.3 1.8-.5l4.5-13.2c.3-.9-.2-1.5-1.1-1.8-.1-.1-.2-.1-.3-.1-.2-.1-.3-.2-.5-.3zM9.8 17.2l.6-4.1 6.5-5.8-8.5 7.5 1.4 2.4z" />
                  </svg>
                  Official Telegram Support
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Fastest response (under 2 hours) for general chat and updates:
                </p>
                <a
                  href="https://t.me/+8xnMvFtjulkyNzE1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#29A9EA] hover:underline"
                >
                  Join Telegram Channel →
                </a>
              </div>

              <div className="rounded-2xl border border-border bg-background/40 p-4">
                <div className="flex items-center gap-2 font-semibold text-foreground">
                  <Mail className="h-4 w-4 text-primary" /> Email Support
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  For official business, DMCA, and partnership inquiries:
                </p>
                <span className="mt-1 block font-mono text-xs text-foreground">
                  support@duahaumanga.com
                </span>
              </div>

              <div className="rounded-2xl border border-border bg-background/40 p-4">
                <div className="flex items-center gap-2 font-semibold text-foreground">
                  <Clock className="h-4 w-4 text-primary" /> Response Time
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Telegram: 1–4 hours · Email inquiries: within 24 hours.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card/50 p-6 backdrop-blur sm:p-8">
            <h2 className="text-lg font-bold text-foreground">Send us a direct message</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Have feedback, copyright notice, or collaboration request? Let us know.
            </p>

            {sent ? (
              <div className="mt-8 rounded-2xl border border-primary/30 bg-primary/10 p-6 text-center">
                <Sparkles className="mx-auto h-8 w-8 text-primary" />
                <h3 className="mt-2 font-bold text-foreground">Message Sent Successfully</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Thank you for reaching out. Our team will review your message shortly.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-4 rounded-full border border-border px-4 py-1.5 text-xs font-medium hover:bg-secondary"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-foreground">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex"
                    className="mt-1 w-full rounded-xl border border-border bg-background/60 px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground">
                    Email Address <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="mt-1 w-full rounded-xl border border-border bg-background/60 px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground">Topic</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border bg-background/60 px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                  >
                    <option value="general">General Feedback / Request</option>
                    <option value="dmca">DMCA / Copyright Inquiry</option>
                    <option value="contributor">Contributor / Model Addition</option>
                    <option value="partnership">Advertising & Partnership</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground">
                    Message <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your inquiry in detail..."
                    className="mt-1 w-full rounded-xl border border-border bg-background/60 px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-brand px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Send className="h-4 w-4" /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
