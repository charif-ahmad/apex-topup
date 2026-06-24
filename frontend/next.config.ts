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
    // dynamic: 15 keeps cookie-backed pages (wallet, dashboard, etc.) cached briefly
    // so back/forward and repeat navigation is instant, while keeping balance/transaction
    // data fresh enough cross-tab. Mutations call router.refresh() to bust the cache for
    // the active route immediately, but that only affects the current tab — so this
    // window is the worst-case staleness for a balance change made elsewhere.
    staleTimes: {
      dynamic: 90,
      static: 180,
    },
    // Prefetch dynamic routes on link hover so the data is usually already
    // warm by the time the user clicks.
    dynamicOnHover: true,
  },
};

export default nextConfig;
