import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required by experimental.cachedNavigations. Enables the Cache Components
  // infrastructure (the Next.js 16 evolution of PPR) so the router can hold
  // RSC payloads client-side between navigations.
  cacheComponents: true,
  experimental: {
    // Next.js 16 gated the client-side router cache behind this flag (default: false).
    // Without it, every <Link> navigation is a fresh server round-trip regardless of
    // staleTimes. Enabling it activates the RSC payload cache on the client.
    cachedNavigations: true,
   
    // How long the client-side router cache holds RSC payloads before re-fetching.
    // dynamic: 30 keeps cookie-backed pages (wallet, dashboard, etc.) cached for 30s
    // so back/forward and repeat navigation is instant. Mutations call router.refresh()
    // to bust the cache for the active route immediately.
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
    // Prefetch dynamic routes on link hover so the data is usually already
    // warm by the time the user clicks.
    dynamicOnHover: true,
  },
};

export default nextConfig;
