import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/drive-file")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const id = url.searchParams.get("id");
        if (!id || !/^[A-Za-z0-9_-]{10,}$/.test(id)) {
          return new Response("invalid id", { status: 400 });
        }

        const candidateUrls = [
          `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`,
          `https://drive.google.com/uc?export=download&id=${id}&confirm=t`,
          `https://docs.google.com/uc?export=download&id=${id}`,
        ];

        let lastStatus = 502;
        for (const target of candidateUrls) {
          try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 12000);
            const upstream = await fetch(target, {
              headers: {
                "user-agent":
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                accept: "*/*",
              },
              redirect: "follow",
              signal: controller.signal,
            });
            clearTimeout(timeout);

            if (upstream.ok && upstream.body) {
              const rawCt = upstream.headers.get("content-type") || "";
              // If it returned an HTML interstitial instead of the real file, continue to next candidate
              if (rawCt.includes("text/html")) {
                const text = await upstream.text();
                // Check if there is a confirmation link in the html
                const match = text.match(/href="(\/download\?[^"]+confirm=[^"]+)"/);
                if (match) {
                  const confirmUrl = `https://drive.usercontent.google.com${match[1].replace(/&amp;/g, "&")}`;
                  const retryRes = await fetch(confirmUrl, {
                    headers: {
                      "user-agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                    },
                    redirect: "follow",
                  });
                  if (retryRes.ok && retryRes.body) {
                    const ct = retryRes.headers.get("content-type") || "application/pdf";
                    return new Response(retryRes.body, {
                      headers: {
                        "content-type": ct.includes("octet-stream") ? "application/pdf" : ct,
                        "cache-control": "public, max-age=86400, s-maxage=86400",
                        "access-control-allow-origin": "*",
                        "content-disposition": "inline",
                      },
                    });
                  }
                }
                continue;
              }

              const ct = rawCt.includes("octet-stream") || !rawCt ? "application/pdf" : rawCt;
              return new Response(upstream.body, {
                headers: {
                  "content-type": ct,
                  "cache-control": "public, max-age=86400, s-maxage=86400",
                  "access-control-allow-origin": "*",
                  "content-disposition": "inline",
                },
              });
            } else {
              lastStatus = upstream.status;
            }
          } catch {
            // Try next candidate endpoint
          }
        }

        return new Response(`upstream ${lastStatus}`, { status: 502 });
      },
    },
  },
});

export {};
