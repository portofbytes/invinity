import path from "node:path";
import type { NextConfig } from "next";

// Static export is opt-in via BUILD_STATIC=1 (set by the GitHub Pages
// workflow). Local `next dev` keeps full server-side behavior so you can
// iterate on forms/server actions as normal.
const isStatic = process.env.BUILD_STATIC === "1";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  allowedDevOrigins: [
    "192.168.1.90",
    "192.168.1.*",
    "localhost",
    "127.0.0.1",
  ],
  ...(isStatic
    ? {
        output: "export",
        // Pages can't run the image optimizer.
        images: { unoptimized: true },
        // GH Pages serves trailing-slash URLs cleanly.
        trailingSlash: true,
        // Set when deploying to https://<user>.github.io/<repo>/ (project
        // page). Leave empty for a custom domain or a user/org page.
        basePath: process.env.BASE_PATH || "",
        assetPrefix: process.env.BASE_PATH || "",
      }
    : {}),
};

export default nextConfig;
