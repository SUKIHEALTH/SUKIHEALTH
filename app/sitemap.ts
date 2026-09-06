import type { MetadataRoute } from "next"
import { siteConfig } from "@/lib/site-config"

const routes = [
  { path: "/", priority: 1 },
  { path: "/services", priority: 0.9 },
  { path: "/corporate-partners", priority: 0.8 },
  { path: "/faq", priority: 0.7 },
  { path: "/contact", priority: 0.7 },
  { path: "/privacy", priority: 0.3 },
  { path: "/terms", priority: 0.3 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return routes.map((route) => ({
    url: `${siteConfig.url}${route.path}`,
    lastModified,
    changeFrequency: "monthly",
    priority: route.priority,
  }))
}
