import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Default OpenNext-on-Cloudflare config. Good enough for launch — we can
// swap the incremental cache to KV or R2 later once we see real traffic.
export default defineCloudflareConfig();
