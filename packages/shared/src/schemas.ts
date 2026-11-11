import { z } from "zod";

export const phoneRegex = /^\+998 \(\d{2}\) \d{3}-\d{2}-\d{2}$/;

export const RegisterSchema = z.object({
  companyName: z.string().min(2, "Min 2").max(120, "Max 120"),
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  phone: z.string().regex(phoneRegex, "Invalid phone format"),
  regionId: z.string().min(1, "Region required"),
  districtId: z.string().min(1, "District required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  login: z.string().min(4, "Min 4").max(32, "Max 32").regex(/^[a-zA-Z0-9_.]+$/, "Only letters, numbers, _, ."),
  password: z.string().min(8, "Min 8 chars").regex(/[a-zA-Z]/, "Letter required").regex(/[0-9]/, "Number required"),
  confirmPassword: z.string().min(8)
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords mismatch",
  path: ["confirmPassword"]
});

export const LoginSchema = z.object({
  login: z.string().min(1, "Login required"),
  password: z.string().min(1, "Password required"),
  rememberMe: z.boolean().optional()
});

export const CreateListingSchema = z.object({
  categoryId: z.string().min(1),
  productId: z.string().min(1),
  title: z.string().min(3).max(150),
  titleRu: z.string().max(150).optional(),
  origin: z.enum(["LOCAL", "IMPORT"]),
  expiryOrHarvestDate: z.string().optional(),
  unit: z.enum(["kg", "tonna", "dona", "litr", "qop", "quti"]),
  pricePerUnit: z.number().positive(),
  isNegotiable: z.boolean().default(false),
  totalQuantity: z.number().positive(),
  images: z.array(z.string()).min(1).max(5),
  description: z.string().max(2000).optional(),
  descriptionRu: z.string().max(2000).optional(),
  delivery: z.enum(["PICKUP", "DELIVERY"]),
  regionId: z.string().min(1),
  districtId: z.string().min(1),
  address: z.string().optional(),
  certificateUrl: z.string().optional(),
  showPhone: z.boolean().default(true)
});

export const CreateContractSchema = z.object({
  listingId: z.string().min(1),
  quantity: z.number().positive()
});

export const MarkSaleSchema = z.object({
  quantity: z.number().positive(),
  orderId: z.string().optional()
});

export const CreateReviewSchema = z.object({
  orderId: z.string().min(1),
  rating: z.number().min(1).max(5),
  text: z.string().min(2).max(1000)
});
