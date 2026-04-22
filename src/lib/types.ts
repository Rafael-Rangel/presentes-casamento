export type ProfileRole = "guest" | "admin";
export type GiftPriority = "essential" | "high" | "normal";
export type GiftStatus =
  | "available"
  | "reserved"
  | "confirmed"
  | "coming_soon";
export type ReservationStatus = "reserved" | "confirmed" | "expired";

export type Gift = {
  id: string;
  title: string;
  description: string;
  estimated_price: number | null;
  category: string;
  priority: GiftPriority;
  status: GiftStatus;
  release_month: string | null;
  image_url: string | null;
  store_url: string | null;
  accent_color?: string;
  created_at: string;
  updated_at: string;
};

export type Guest = {
  id: string;
  slug: string;
  display_name: string;
  email: string | null;
  phone: string | null;
  notes: string;
  created_at: string;
};

export type ReservationRow = {
  id: string;
  gift_id: string;
  user_id: string;
  message: string;
  purchase_estimate: string | null;
  receipt_path: string | null;
  expires_at: string;
  is_surprise: boolean;
  status: ReservationStatus;
  created_at: string;
};
