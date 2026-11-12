export function normalizeWebhookUrl(url: string) {
  return url.replace("/webhook/", "/webhooks/");
}
