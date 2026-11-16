import mockData from "./mock-data.json";

// Browser-local demo backend: used only when there is no live NestJS API to talk to
// (e.g. the Vercel deployment). Persists contracts/orders/chat/favorites in
// localStorage so real actions (buy, accept, chat) actually change state between
// page loads, tied to the real seller of each listing instead of a fixed example.

const DB_KEY = "uzsavdo_demo_db_v1";
const USER_KEY = "uzsavdo_user";
const LOGGED_OUT_KEY = "uzsavdo_logged_out";

// Keep in sync with defaultDemoUser in lib/auth.tsx — this is the identity a
// visitor starts as before switching into any seller's view.
const DEFAULT_BUYER = {
  id: "demo-id",
  login: "demo",
  firstName: "Alisher",
  lastName: "Usmonov",
  companyName: "Sharq Agro Fayz MCHJ",
  phone: "+998 90 123 45 67",
  role: "USER",
  regionId: "reg-2",
  districtId: "dist-2"
};

interface DemoDB {
  contracts: any[];
  orders: any[];
  conversations: any[];
  messages: any[];
  favorites: { userId: string; listingId: string }[];
  notifications: any[];
}

function loadDB(): DemoDB {
  let db: any = {};
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(DB_KEY);
      if (raw) db = JSON.parse(raw);
    } catch {}
  }
  db.contracts ||= [];
  db.orders ||= [];
  db.conversations ||= [];
  db.messages ||= [];
  db.favorites ||= [];
  db.notifications ||= [];
  return db as DemoDB;
}

function saveDB(db: DemoDB) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch {}
}

function getActiveUser(): any {
  if (typeof window === "undefined") return DEFAULT_BUYER;
  if (localStorage.getItem(LOGGED_OUT_KEY) === "true") return null;
  const saved = localStorage.getItem(USER_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {}
  }
  return DEFAULT_BUYER;
}

function findListing(listingId: string): any {
  return (mockData.listings as any[]).find((l) => l.id === listingId) || null;
}

function shapeProfile(p: any) {
  if (!p) return null;
  return {
    id: p.id,
    companyName: p.companyName,
    firstName: p.firstName,
    lastName: p.lastName,
    phone: p.phone,
    login: p.login,
    role: "USER",
    regionId: p.regionId,
    districtId: p.districtId
  };
}

function allKnownProfiles(): any[] {
  const sellers = new Map<string, any>();
  (mockData.listings as any[]).forEach((l) => {
    if (l.seller && !sellers.has(l.seller.id)) sellers.set(l.seller.id, l.seller);
  });
  return [DEFAULT_BUYER, ...Array.from(sellers.values())];
}

function getProfileById(id: string | null | undefined) {
  if (!id) return null;
  const found = allKnownProfiles().find((p) => p.id === id);
  return found ? shapeProfile(found) : null;
}

function pushNotification(db: DemoDB, userId: string, type: string, link: string) {
  db.notifications.push({
    id: `demo-notif-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    userId,
    type,
    link,
    createdAt: new Date().toISOString(),
    readAt: null
  });
}

function hydrateContract(contract: any, buyerOverride?: any) {
  const listing = findListing(contract.listingId);
  const buyer = buyerOverride || getProfileById(contract.buyerId);
  const seller = listing ? shapeProfile(listing.seller) : getProfileById(contract.sellerId);
  return { ...contract, listing, buyer, seller };
}

function hydrateOrder(order: any, db?: DemoDB) {
  const listing = findListing(order.listingId);
  const theDb = db || loadDB();
  const contract = theDb.contracts.find((c: any) => c.id === order.contractId);
  return {
    ...order,
    listing,
    buyer: getProfileById(order.buyerId),
    seller: getProfileById(order.sellerId),
    contract: contract ? { id: contract.id, number: contract.number } : null
  };
}

function hydrateConversation(conv: any, db?: DemoDB) {
  const theDb = db || loadDB();
  const contract = theDb.contracts.find((c: any) => c.id === conv.contractId);
  const listing = contract ? findListing(contract.listingId) : null;
  const msgs = theDb.messages
    .filter((m: any) => m.conversationId === conv.id)
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return {
    ...conv,
    buyer: getProfileById(conv.buyerId),
    seller: getProfileById(conv.sellerId),
    contract: contract ? { number: contract.number, listing: listing ? { title: listing.title } : null } : null,
    messages: msgs.slice(0, 1)
  };
}

export function createContract({ listingId, quantity }: { listingId: string; quantity: number }) {
  const listing = findListing(listingId);
  if (!listing) throw new Error("Eʼlon topilmadi");
  const buyer = getActiveUser();
  if (!buyer) throw new Error("Avval tizimga kiring");
  if (listing.sellerId === buyer.id) throw new Error("Oʻz eʼloningizdan xarid qila olmaysiz");

  const db = loadDB();
  const number = `SH-${new Date().getFullYear()}-${String(db.contracts.length + 1).padStart(6, "0")}`;
  const contract = {
    id: `demo-contract-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    number,
    listingId,
    buyerId: buyer.id,
    sellerId: listing.sellerId,
    quantity: Number(quantity),
    unit: listing.unit,
    pricePerUnit: listing.pricePerUnit,
    estimatedTotal: Number(listing.pricePerUnit) * Number(quantity),
    fee: 0,
    isTrial: true,
    status: "PAID",
    paidAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };
  db.contracts.push(contract);

  // Open the real chat between this exact buyer and this exact seller right away
  db.conversations.push({
    id: `demo-conv-${contract.id}`,
    contractId: contract.id,
    buyerId: buyer.id,
    sellerId: listing.sellerId,
    lastMessageAt: new Date().toISOString()
  });

  saveDB(db);
  return hydrateContract(contract, buyer);
}

export function getContracts(role: "buyer" | "seller") {
  const user = getActiveUser();
  if (!user) return [];
  const db = loadDB();
  return db.contracts
    .filter((c: any) => (role === "seller" ? c.sellerId === user.id : c.buyerId === user.id))
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((c: any) => hydrateContract(c));
}

export function createOrderFromContract({ contractId }: { contractId: string }) {
  const db = loadDB();
  const contract = db.contracts.find((c: any) => c.id === contractId);
  if (!contract) throw new Error("Shartnoma topilmadi");

  let order = db.orders.find((o: any) => o.contractId === contractId);
  if (!order) {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 72);
    order = {
      id: `demo-order-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      contractId: contract.id,
      listingId: contract.listingId,
      buyerId: contract.buyerId,
      sellerId: contract.sellerId,
      quantity: contract.quantity,
      status: "PENDING",
      rejectReason: null,
      expiresAt: expiresAt.toISOString(),
      acceptedAt: null,
      rejectedAt: null,
      completedAt: null,
      createdAt: new Date().toISOString()
    };
    db.orders.push(order);
    pushNotification(db, contract.sellerId, "ORDER_RECEIVED", "/orders");
    saveDB(db);
  }
  return hydrateOrder(order, db);
}

export function getOrders(role: "buyer" | "seller") {
  const user = getActiveUser();
  if (!user) return [];
  const db = loadDB();
  return db.orders
    .filter((o: any) => (role === "buyer" ? o.buyerId === user.id : o.sellerId === user.id))
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((o: any) => hydrateOrder(o, db));
}

export function acceptOrder(id: string) {
  const user = getActiveUser();
  const db = loadDB();
  const order = db.orders.find((o: any) => o.id === id);
  if (!order) throw new Error("Buyurtma topilmadi");
  if (!user || order.sellerId !== user.id) throw new Error("Ruxsat berilmagan");
  order.status = "ACCEPTED";
  order.acceptedAt = new Date().toISOString();
  pushNotification(db, order.buyerId, "ORDER_ACCEPTED", "/orders");
  saveDB(db);
  return hydrateOrder(order, db);
}

export function rejectOrder(id: string, reason: string) {
  const user = getActiveUser();
  const db = loadDB();
  const order = db.orders.find((o: any) => o.id === id);
  if (!order) throw new Error("Buyurtma topilmadi");
  if (!user || order.sellerId !== user.id) throw new Error("Ruxsat berilmagan");
  order.status = "REJECTED";
  order.rejectReason = reason || null;
  order.rejectedAt = new Date().toISOString();
  pushNotification(db, order.buyerId, "ORDER_REJECTED", "/orders");
  saveDB(db);
  return hydrateOrder(order, db);
}

export function completeOrder(id: string) {
  const db = loadDB();
  const order = db.orders.find((o: any) => o.id === id);
  if (!order) throw new Error("Buyurtma topilmadi");
  order.status = "COMPLETED";
  order.completedAt = new Date().toISOString();
  saveDB(db);
  return hydrateOrder(order, db);
}

export function getConversations() {
  const user = getActiveUser();
  if (!user) return [];
  const db = loadDB();
  return db.conversations
    .filter((c: any) => c.buyerId === user.id || c.sellerId === user.id)
    .sort((a: any, b: any) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime())
    .map((c: any) => hydrateConversation(c, db));
}

export function getOrCreateConversationByContract(contractId: string) {
  const user = getActiveUser();
  const db = loadDB();
  const contract = db.contracts.find((c: any) => c.id === contractId);
  if (!contract) throw new Error("Shartnoma topilmadi");
  if (!user || (contract.buyerId !== user.id && contract.sellerId !== user.id)) {
    throw new Error("Ruxsat berilmagan");
  }
  let conv = db.conversations.find((c: any) => c.contractId === contractId);
  if (!conv) {
    conv = {
      id: `demo-conv-${contractId}`,
      contractId,
      buyerId: contract.buyerId,
      sellerId: contract.sellerId,
      lastMessageAt: new Date().toISOString()
    };
    db.conversations.push(conv);
    saveDB(db);
  }
  return hydrateConversation(conv, db);
}

export function getOrCreateConversationByListing(listingId: string) {
  const user = getActiveUser();
  if (!user) throw new Error("Avval tizimga kiring");
  const db = loadDB();
  const contract = [...db.contracts]
    .reverse()
    .find((c: any) => c.listingId === listingId && (c.buyerId === user.id || c.sellerId === user.id));
  if (!contract) throw new Error("Bu mahsulot boʻyicha shartnoma topilmadi");
  return getOrCreateConversationByContract(contract.id);
}

export function getMessages(conversationId: string) {
  const db = loadDB();
  return db.messages
    .filter((m: any) => m.conversationId === conversationId)
    .sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map((m: any) => ({ ...m, sender: getProfileById(m.senderId) }));
}

export function sendMessage(conversationId: string, text: string) {
  const user = getActiveUser();
  if (!user) throw new Error("Avval tizimga kiring");
  const db = loadDB();
  const conv = db.conversations.find((c: any) => c.id === conversationId);
  if (!conv) throw new Error("Suhbat topilmadi");
  const msg = {
    id: `demo-msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    conversationId,
    senderId: user.id,
    text,
    createdAt: new Date().toISOString()
  };
  db.messages.push(msg);
  conv.lastMessageAt = msg.createdAt;
  saveDB(db);
  return { ...msg, sender: getProfileById(user.id) || user };
}

export function getFavorites() {
  const user = getActiveUser();
  if (!user) return [];
  const db = loadDB();
  return db.favorites
    .filter((f) => f.userId === user.id)
    .map((f) => findListing(f.listingId))
    .filter(Boolean);
}

export function addFavorite(listingId: string) {
  const user = getActiveUser();
  if (!user) return { success: true };
  const db = loadDB();
  if (!db.favorites.some((f) => f.userId === user.id && f.listingId === listingId)) {
    db.favorites.push({ userId: user.id, listingId });
    saveDB(db);
  }
  return { success: true };
}

export function removeFavorite(listingId: string) {
  const user = getActiveUser();
  if (!user) return { success: true };
  const db = loadDB();
  db.favorites = db.favorites.filter((f) => !(f.userId === user.id && f.listingId === listingId));
  saveDB(db);
  return { success: true };
}

export function getNotifications() {
  const user = getActiveUser();
  if (!user) return [];
  const db = loadDB();
  return db.notifications
    .filter((n: any) => n.userId === user.id)
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function markAllNotificationsRead() {
  const user = getActiveUser();
  if (!user) return { success: true };
  const db = loadDB();
  db.notifications.forEach((n: any) => {
    if (n.userId === user.id) n.readAt = new Date().toISOString();
  });
  saveDB(db);
  return { success: true };
}
