export const API_BASE =
  process.env.EXPO_PUBLIC_API_URL ?? "https://www.beautiro.com";

export type PublicUser = {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  locale: string;
  role: "USER" | "ADMIN";
  emailVerified: boolean;
};

const SESSION_KEY = "beautiro_session_token";

export async function getStoredToken() {
  const SecureStore = await import("expo-secure-store");
  return SecureStore.getItemAsync(SESSION_KEY);
}

export async function setStoredToken(token: string | null) {
  const SecureStore = await import("expo-secure-store");
  if (!token) {
    await SecureStore.deleteItemAsync(SESSION_KEY);
    return;
  }
  await SecureStore.setItemAsync(SESSION_KEY, token);
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const token = await getStoredToken();
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  headers.set("X-Beautiro-Client", "mobile");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
  });

  const data = (await res.json()) as T & { error?: string };
  if (!res.ok) {
    throw new Error((data as { error?: string }).error ?? "REQUEST_FAILED");
  }
  return data;
}

export async function login(email: string, password: string) {
  const data = await apiFetch<{ user: PublicUser; sessionToken?: string }>(
    "/api/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    },
  );
  if (data.sessionToken) await setStoredToken(data.sessionToken);
  return data.user;
}

export async function signup(input: {
  email: string;
  password: string;
  name: string;
  phone?: string;
  locale?: string;
}) {
  const data = await apiFetch<{ user: PublicUser; sessionToken?: string }>(
    "/api/auth/signup",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
  if (data.sessionToken) await setStoredToken(data.sessionToken);
  return data.user;
}

export async function logout() {
  await apiFetch("/api/auth/logout", { method: "POST" });
  await setStoredToken(null);
}

export async function fetchMe() {
  const data = await apiFetch<{ user: PublicUser | null }>("/api/auth/me");
  return data.user;
}

export async function fetchBookings() {
  const data = await apiFetch<{
    bookings: Array<{
      id: string;
      status: string;
      createdAt: string;
      preferredDate: string | null;
      services: Array<{ type: string }>;
    }>;
  }>("/api/bookings");
  return data.bookings;
}

export async function createBooking(input: {
  locale: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  preferredDate?: string;
  notes?: string;
  services: { van: boolean; interpreter: boolean; fx: boolean };
}) {
  const data = await apiFetch<{ id: string }>("/api/bookings", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return data.id;
}

export function googleAuthUrl(locale = "en") {
  return `${API_BASE}/api/auth/google?locale=${locale}&returnTo=${encodeURIComponent(`/${locale}/book?tab=account`)}`;
}
