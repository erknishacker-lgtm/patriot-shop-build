const SUPABASE_HOST = "https://jycmajdulenpuotzecch.supabase.co";

export function securityHeaders(requestUrl: string): Record<string, string> {
  const https = requestUrl.startsWith("https:");
  const connect = [
    "'self'",
    SUPABASE_HOST,
    "https://*.supabase.co",
    "https://fonts.googleapis.com",
    "https://fonts.gstatic.com",
  ];
  if (!https) {
    connect.push("ws:", "wss:", "http://localhost:*", "ws://localhost:*");
  }

  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https:",
    `connect-src ${connect.join(" ")}`,
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    ...(https ? ["upgrade-insecure-requests"] : []),
  ].join("; ");

  return {
    "Content-Security-Policy": csp,
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "geolocation=(), camera=(), microphone=(), payment=()",
    "Cross-Origin-Opener-Policy": "same-origin",
    "X-DNS-Prefetch-Control": "off",
    ...(https
      ? { "Strict-Transport-Security": "max-age=31536000; includeSubDomains" }
      : {}),
  };
}

export function withSecurityHeaders(request: Request, response: Response): Response {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(securityHeaders(request.url))) {
    headers.set(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
