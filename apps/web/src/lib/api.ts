import mockData from "./mock-data.json";
import * as demoStore from "./demoStore";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" ? "/api/v1" : "http://localhost:4000/api/v1");

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    });

    if (res.ok) {
      return await res.json().catch(() => ({}));
    }
  } catch (err) {
    // Fallback to embedded offline data for standalone cloud deployment
  }

  // Handle mock responses for cloud demo without live local API
  const cleanEndpoint = endpoint.split("?")[0];
  const queryStr = endpoint.includes("?") ? endpoint.split("?")[1] : "";
  const query = new URLSearchParams(queryStr);
  const method = (options.method || "GET").toUpperCase();
  const parseBody = (): any => {
    if (!options.body) return {};
    try {
      return typeof options.body === "string" ? JSON.parse(options.body) : options.body;
    } catch {
      return {};
    }
  };

  if (cleanEndpoint === "/categories") {
    return mockData.categories;
  }

  if (cleanEndpoint === "/regions") {
    return mockData.regions;
  }

  if (cleanEndpoint === "/listings") {
    let items = [...mockData.listings];
    const catId = query.get("categoryId");
    if (catId) {
      items = items.filter((it: any) => it.categoryId === catId);
    }
    const regId = query.get("regionId");
    if (regId) {
      items = items.filter((it: any) => it.regionId === regId);
    }
    const distId = query.get("districtId");
    if (distId) {
      items = items.filter((it: any) => it.districtId === distId);
    }
    const q = query.get("q");
    if (q) {
      const qLower = q.toLowerCase();
      items = items.filter(
        (it: any) =>
          it.title?.toLowerCase().includes(qLower) ||
          it.titleRu?.toLowerCase().includes(qLower)
      );
    }
    const limit = query.get("limit");
    if (limit) {
      items = items.slice(0, parseInt(limit, 10));
    }
    return {
      items,
      total: items.length,
      page: 1,
      totalPages: 1
    };
  }

  if (cleanEndpoint.startsWith("/listings/")) {
    const id = cleanEndpoint.replace("/listings/", "");
    const found = mockData.listings.find((it: any) => it.id === id);
    if (found) return found;
    return mockData.listings[0];
  }

  if (cleanEndpoint === "/favorites") {
    return demoStore.getFavorites();
  }
  const favoriteMatch = cleanEndpoint.match(/^\/favorites\/(.+)$/);
  if (favoriteMatch) {
    return method === "DELETE"
      ? demoStore.removeFavorite(favoriteMatch[1])
      : demoStore.addFavorite(favoriteMatch[1]);
  }

  if (cleanEndpoint === "/contracts") {
    if (method === "POST") {
      return demoStore.createContract(parseBody());
    }
    return demoStore.getContracts((query.get("role") as "buyer" | "seller") || "buyer");
  }

  if (cleanEndpoint === "/orders") {
    if (method === "POST") {
      return demoStore.createOrderFromContract(parseBody());
    }
    return demoStore.getOrders((query.get("role") as "buyer" | "seller") || "seller");
  }

  const orderActionMatch = cleanEndpoint.match(/^\/orders\/([^/]+)\/(accept|reject|complete)$/);
  if (orderActionMatch) {
    const [, orderId, action] = orderActionMatch;
    if (action === "accept") return demoStore.acceptOrder(orderId);
    if (action === "reject") return demoStore.rejectOrder(orderId, parseBody().reason);
    return demoStore.completeOrder(orderId);
  }

  if (cleanEndpoint === "/conversations") {
    return demoStore.getConversations();
  }

  const byContractMatch = cleanEndpoint.match(/^\/conversations\/by-contract\/(.+)$/);
  if (byContractMatch) {
    return demoStore.getOrCreateConversationByContract(byContractMatch[1]);
  }

  const byListingMatch = cleanEndpoint.match(/^\/conversations\/by-listing\/(.+)$/);
  if (byListingMatch) {
    return demoStore.getOrCreateConversationByListing(byListingMatch[1]);
  }

  const messagesMatch = cleanEndpoint.match(/^\/conversations\/([^/]+)\/messages$/);
  if (messagesMatch) {
    const conversationId = messagesMatch[1];
    if (method === "POST") {
      return demoStore.sendMessage(conversationId, parseBody().text || "");
    }
    return demoStore.getMessages(conversationId);
  }

  if (cleanEndpoint === "/notifications") {
    return demoStore.getNotifications();
  }

  if (cleanEndpoint === "/notifications/read-all") {
    return demoStore.markAllNotificationsRead();
  }

  if (cleanEndpoint === "/auth/login") {
    const body = options.body ? JSON.parse(options.body as string) : {};
    if (body.login === "admin") {
      return {
        user: {
          id: "admin-id",
          login: "admin",
          firstName: "Admin",
          lastName: "Hokimiyat",
          companyName: "Toshkent shahar Hokimiyati",
          phone: "+998 71 200 00 00",
          role: "ADMIN"
        }
      };
    }
    return {
      user: {
        id: "demo-id",
        login: "demo",
        firstName: "Alisher",
        lastName: "Usmonov",
        companyName: "Sharq Agro Fayz MCHJ",
        phone: "+998 90 123 45 67",
        role: "USER"
      }
    };
  }

  if (cleanEndpoint === "/me") {
    return null;
  }

  return {};
}
