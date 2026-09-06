/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), geolocation=(), payment=(), microphone=(self)" },
          {
            key: "Content-Security-Policy-Report-Only",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://unpkg.com https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://api.elevenlabs.io https://api.us.elevenlabs.io wss://api.elevenlabs.io wss://api.us.elevenlabs.io https://vitals.vercel-insights.com",
              "media-src 'self' blob: https://api.elevenlabs.io https://api.us.elevenlabs.io",
              "frame-src 'self' https://expatclinic.trafft.com",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self' mailto:",
            ].join("; "),
          },
        ],
      },
    ]
  },
}

export default nextConfig
