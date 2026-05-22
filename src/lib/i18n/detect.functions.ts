import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";

const COUNTRY_TO_LANG: Record<string, string> = {
  VN: "vi",
  JP: "ja",
  CN: "zh", TW: "zh", HK: "zh", MO: "zh", SG: "zh",
  KR: "ko",
};

export const detectLanguage = createServerFn({ method: "GET" }).handler(async () => {
  const country =
    getRequestHeader("cf-ipcountry") ||
    getRequestHeader("x-vercel-ip-country") ||
    getRequestHeader("x-country-code") ||
    "";
  const accept = (getRequestHeader("accept-language") || "").toLowerCase();
  let lang = COUNTRY_TO_LANG[country.toUpperCase()];
  if (!lang) {
    if (accept.startsWith("vi")) lang = "vi";
    else if (accept.startsWith("ja")) lang = "ja";
    else if (accept.startsWith("ko")) lang = "ko";
    else if (accept.startsWith("zh")) lang = "zh";
    else lang = "en";
  }
  return { lang, country: country.toUpperCase() || null };
});