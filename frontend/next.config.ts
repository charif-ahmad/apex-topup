import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Client-side Router Cache. By default Next treats dynamic (cookie-backed)
    // routes as stale immediately (dynamic: 0), so navigating back to an
    // already-visited page does a full server round-trip and re-hits the API.
    // Reusing the cached RSC payload for a short window makes back/forward and
    // repeat navigation instant. 30s keeps financial data (wallet balance,
    // transactions) reasonably fresh; mutations call router.refresh() which
    // busts the cache for the active route immediately.
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
