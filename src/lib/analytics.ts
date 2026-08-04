export type AnalyticsEvent =
  | "WhatsAppClick"
  | "Lead"
  | "CompleteRegistration"
  | "ViewContent";

declare global {
  interface Window {
    fbq?: (
      action: string,
      event: string,
      params?: Record<string, unknown>,
    ) => void;
  }
}

export function trackMetaEvent(
  event: AnalyticsEvent | string,
  params?: Record<string, unknown>,
) {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", event, params);
}

export function trackWhatsAppClick(location: string) {
  trackMetaEvent("WhatsAppClick", { content_name: location });
  trackMetaEvent("Lead", { content_name: `whatsapp_${location}` });
}

export function trackBookingComplete(referenceId: string) {
  trackMetaEvent("CompleteRegistration", { content_name: referenceId });
  trackMetaEvent("Lead", { content_name: "booking_submit" });
}

export function trackReviewSubmit() {
  trackMetaEvent("Lead", { content_name: "review_submit" });
}

export function trackPageView(contentName: string) {
  trackMetaEvent("ViewContent", { content_name: contentName });
}
