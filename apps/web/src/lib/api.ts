import mockData from "./mock-data.json";

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

  if (cleanEndpoint === "/orders") {
    return [
      {
        id: "ord-1",
        quantity: 500,
        status: "PENDING",
        createdAt: new Date().toISOString(),
        contract: {
          number: "SH-2026-000142",
          listing: mockData.listings[0]
        },
        buyer: {
          companyName: "Toshkent Savdo MCHJ",
          firstName: "Jamshid"
        }
      }
    ];
  }

  if (cleanEndpoint === "/contracts") {
    return [
      {
        id: "cnt-1",
        number: "SH-2026-000142",
        status: "PAID",
        createdAt: new Date().toISOString(),
        listing: mockData.listings[0],
        seller: { companyName: "Sharq Agro Fayz MCHJ" },
        buyer: { companyName: "Toshkent Savdo MCHJ" }
      }
    ];
  }

  if (cleanEndpoint === "/conversations") {
    return [
      {
        id: "conv-1",
        lastMessageAt: new Date().toISOString(),
        contract: { listing: mockData.listings[0] },
        buyer: { companyName: "Toshkent Savdo MCHJ" },
        seller: { companyName: "Sharq Agro Fayz MCHJ" }
      }
    ];
  }

  if (cleanEndpoint.includes("/messages")) {
    return [
      {
        id: "msg-1",
        text: "Assalomu alaykum! Mahsulot buyurtmangiz tayyor, qachon yetkazib beraylik?",
        senderId: "seller-1",
        createdAt: new Date().toISOString()
      }
    ];
  }

  if (cleanEndpoint === "/notifications") {
    return [
      {
        id: "notif-1",
        link: "/orders",
        createdAt: new Date().toISOString(),
        readAt: null
      }
    ];
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
    return {
      user: {
        id: "admin-id",
        login: "admin",
        companyName: "Toshkent shahar Hokimiyati",
        firstName: "Admin",
        lastName: "Hokimiyat",
        role: "ADMIN"
      }
    };
  }

  return {};
}
