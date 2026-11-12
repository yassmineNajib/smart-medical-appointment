// @ts-nocheck
import http from "node:http";
import https from "node:https";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const LOCAL_WEBHOOK_PROXIES = {
  "/api/text-appointment": "VITE_TEXT_APPOINTMENT_URL",
  "/api/confirm-presence": "VITE_CONFIRM_PRESENCE_URL",
  "/api/cancel-appointment": "VITE_CANCEL_APPOINTMENT_URL",
};

function localWebhookProxy(env: Record<string, string>) {
  return {
    name: "local-webhook-proxy",
    configureServer(server) {
      if (server.httpServer) {
        server.httpServer.timeout = 0;
        server.httpServer.requestTimeout = 0;
        server.httpServer.headersTimeout = 0;
        server.httpServer.keepAliveTimeout = 0;
      }

      Object.entries(LOCAL_WEBHOOK_PROXIES).forEach(([localPath, envKey]) => {
        server.middlewares.use(localPath, (req, res) => {
          if (req.method === "OPTIONS") {
            res.statusCode = 204;
            res.end();
            return;
          }

          if (req.method !== "POST") {
            res.statusCode = 405;
            res.setHeader("content-type", "application/json");
            res.end(JSON.stringify({ success: false, message: "Method not allowed." }));
            return;
          }

          const targetUrl = env[envKey];
          if (!targetUrl) {
            res.statusCode = 500;
            res.setHeader("content-type", "application/json");
            res.end(JSON.stringify({ success: false, message: `Missing ${envKey}.` }));
            return;
          }

          const target = new URL(targetUrl);
          const client = target.protocol === "https:" ? https : http;
          const chunks: Buffer[] = [];

          req.setTimeout?.(0);
          res.setTimeout?.(0);

          req.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
          req.on("end", () => {
            const body = Buffer.concat(chunks);
            const headers = {
              ...req.headers,
              host: target.host,
              connection: "keep-alive",
              "content-length": String(body.length),
            };

            const proxyReq = client.request(
              {
                protocol: target.protocol,
                hostname: target.hostname,
                port: target.port || undefined,
                path: `${target.pathname}${target.search}`,
                method: "POST",
                headers,
                timeout: 0,
              },
              (proxyRes) => {
                res.statusCode = proxyRes.statusCode || 502;
                for (const [key, value] of Object.entries(proxyRes.headers)) {
                  if (value !== undefined && key.toLowerCase() !== "transfer-encoding") {
                    res.setHeader(key, value);
                  }
                }
                proxyRes.pipe(res);
              },
            );

            proxyReq.setTimeout(0);
            proxyReq.on("error", (error) => {
              if (res.headersSent) {
                res.destroy(error);
                return;
              }

              res.statusCode = 502;
              res.setHeader("content-type", "application/json");
              res.end(
                JSON.stringify({
                  success: false,
                  status: "proxy_error",
                  message: "Le proxy local a perdu la connexion avec le backend.",
                  error: error instanceof Error ? error.message : String(error),
                }),
              );
            });

            proxyReq.end(body);
          });
        });
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), localWebhookProxy(env)],
    server: {
      proxy: {
        "/webhooks": {
          target: "https://stg-orch-api.abafusion.ai",
          changeOrigin: true,
          secure: true,
          timeout: 0,
          proxyTimeout: 0,
        },
      },
    },
  };
});
