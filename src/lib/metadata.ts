import { readBoundedText, safeFetch } from "@/lib/ssrf";

const MAX_HTML_BYTES = 1_000_000;

export interface PageMetadata {
  title?: string;
  description?: string;
  image?: string;
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number.parseInt(dec, 10)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'");
}

function parseAttributes(tag: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const re = /([a-zA-Z][\w:-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
  for (const match of tag.matchAll(re)) {
    attrs[match[1].toLowerCase()] = match[2] ?? match[3] ?? "";
  }
  return attrs;
}

function resolveUrl(value: string, baseUrl: string): string | undefined {
  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return undefined;
  }
}

export function extractMetadata(html: string, baseUrl: string): PageMetadata {
  const og: Record<string, string> = {};
  let description: string | undefined;

  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const attrs = parseAttributes(tag);
    const key = attrs.property ?? attrs.name;
    if (!key || !attrs.content) continue;
    if (key.startsWith("og:")) og[key] = attrs.content;
    else if (key === "description" && !description) description = attrs.content;
  }

  let iconHref: string | undefined;
  for (const tag of html.match(/<link\b[^>]*>/gi) ?? []) {
    const attrs = parseAttributes(tag);
    if (attrs.href && /(^|\s)icon(\s|$)/.test(attrs.rel?.toLowerCase() ?? "")) {
      iconHref = attrs.href;
      break;
    }
  }

  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const rawTitle = og["og:title"] ?? titleMatch?.[1];
  const rawDescription = og["og:description"] ?? description;
  const rawImage = og["og:image"] ?? iconHref;

  return {
    title: rawTitle ? decodeHtmlEntities(rawTitle).trim().slice(0, 200) : undefined,
    description: rawDescription ? decodeHtmlEntities(rawDescription).trim().slice(0, 10000) : undefined,
    image: rawImage ? resolveUrl(rawImage, baseUrl) : undefined,
  };
}

export async function fetchPageMetadata(url: string): Promise<PageMetadata> {
  const response = await safeFetch(url);
  if (!response.ok) throw new Error(`Unexpected status ${response.status}`);

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html")) throw new Error("Not an HTML page");

  const html = await readBoundedText(response, MAX_HTML_BYTES);
  return extractMetadata(html, response.url || url);
}
