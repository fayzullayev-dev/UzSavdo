export enum UserRole {
  USER = "USER",
  MODERATOR = "MODERATOR",
  ADMIN = "ADMIN"
}

export enum RegionType {
  REPUBLIC = "REPUBLIC",
  VILOYAT = "VILOYAT",
  CITY = "CITY"
}

export enum DistrictType {
  CITY = "CITY",
  DISTRICT = "DISTRICT"
}

export enum OriginType {
  LOCAL = "LOCAL",
  IMPORT = "IMPORT"
}

export enum DeliveryType {
  PICKUP = "PICKUP",
  DELIVERY = "DELIVERY"
}

export enum ListingStatus {
  ACTIVE = "ACTIVE",
  SOLD = "SOLD",
  ARCHIVED = "ARCHIVED",
  EXPIRED = "EXPIRED",
  BLOCKED = "BLOCKED"
}

export enum ContractStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  CANCELLED = "CANCELLED"
}

export enum OrderStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  EXPIRED = "EXPIRED",
  COMPLETED = "COMPLETED",
  OUT_OF_STOCK = "OUT_OF_STOCK"
}

export enum PaymentProvider {
  CLICK = "CLICK",
  PAYME = "PAYME"
}

export enum PaymentMode {
  MOCK = "MOCK",
  LIVE = "LIVE"
}

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED"
}

export enum ComplaintStatus {
  PENDING = "PENDING",
  IN_REVIEW = "IN_REVIEW",
  RESOLVED = "RESOLVED",
  DISMISSED = "DISMISSED"
}

export enum SupportTicketStatus {
  OPEN = "OPEN",
  ANSWERED = "ANSWERED",
  CLOSED = "CLOSED"
}

export type UnitType = "kg" | "tonna" | "dona" | "litr" | "qop" | "quti";

export interface UserSummary {
  id: string;
  companyName: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string | null;
  telegram?: string | null;
  regionId: string;
  districtId: string;
  address?: string | null;
  logoUrl?: string | null;
  role: UserRole;
  ratingAvg: number;
  ratingCount: number;
  ordersAnsweredOnTime: number;
  ordersIgnored: number;
  createdAt: string;
}

export interface SellerPublicInfo {
  id: string;
  ratingAvg: number;
  ratingCount: number;
  responseRatePercent: number;
  memberSinceYear: number;
  companyName?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  telegram?: string | null;
  address?: string | null;
  regionName?: string;
  districtName?: string;
  isUnlocked: boolean;
}
