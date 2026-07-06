import dns from "node:dns/promises";
import net from "node:net";

const MAX_REDIRECTS = 5;
const FETCH_TIMEOUT_MS = 5000;

function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return true;
  const [a, b] = parts;
  if (a === 0 || a === 127 || a === 10 || a >= 224) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 169 && b === 254) return true; // link-local, incl. cloud metadata endpoints
  return false;
}

function isPrivateIPv6(ip: string): boolean {
  const lower = ip.toLowerCase();
  if (lower === "::1" || lower === "::") return true;
  if (lower.startsWith("fe80:")) return true; // link-local
  if (lower.startsWith("fc") || lower.startsWith("fd")) return true; // unique local
  if (lower.startsWith("::ffff:")) return isPrivateIPv4(lower.slice(7));
  return false;
}

function isPrivateIp(ip: string): boolean {
  if (net.isIPv4(ip)) return isPrivateIPv4(ip);
  if (net.isIPv6(ip)) return isPrivateIPv6(ip);
  return true;
}

async function assertPublicHostname(hostname: string): Promise<void> {
  if (hostname === "localhost") throw new Error("Blocked host");
  const records = await dns.lookup(hostname, { all: true });
  if (records.length === 0 || records.some(({ address }) => isPrivateIp(address))) {
    throw new Error("Blocked host");
  }
}

/**
 * Fetches a URL while guarding against SSRF: rejects non-http(s) schemes and
 * loopback/private/link-local targets (incl. the 169.254.169.254 cloud metadata
 * endpoint), and re-validates every redirect hop instead of letting fetch follow
 * them automatically, since a malicious server could redirect to internal
 * infrastructure only after the initial check passes.
 *
 * DNS is re-resolved here and again by `fetch` itself, leaving a narrow
 * DNS-rebinding window; acceptable for a best-effort link-preview feature.
 */
export async function safeFetch(startUrl: string): Promise<Response> {
  let current = new URL(startUrl);

  for (let i = 0; i <= MAX_REDIRECTS; i++) {
    if (current.protocol !== "http:" && current.protocol !== "https:") {
      throw new Error("Unsupported protocol");
    }
    await assertPublicHostname(current.hostname);

    const response = await fetch(current, {
      redirect: "manual",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: { "User-Agent": "CartaFlow-LinkPreview/1.0" },
    });

    const location = response.headers.get("location");
    if (response.status >= 300 && response.status < 400 && location) {
      current = new URL(location, current);
      continue;
    }

    return response;
  }

  throw new Error("Too many redirects");
}

/** Reads a response body as text, aborting once `maxBytes` is exceeded. */
export async function readBoundedText(response: Response, maxBytes: number): Promise<string> {
  const reader = response.body?.getReader();
  if (!reader) return "";

  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      chunks.push(value.subarray(0, value.byteLength - (total - maxBytes)));
      await reader.cancel();
      break;
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks).toString("utf-8");
}
