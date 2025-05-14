
// Define metadata types for business styling
export interface BusinessStyleMetadataJson {
  background_color: string;
  heading_text_color: string;
  body_text_color: string;
  action_text_color: string;
  button_bg_color_1: string;
  button_bg_color_2: string;
  button_text_color_1: string;
  button_text_color_2: string;
  brand_tone: string;
  email_verified: boolean;
  phone_verified: boolean;
  uses_default_logo: boolean;
  default_logo_id?: string;
}

// Default styling metadata values
export const DEFAULT_METADATA: BusinessStyleMetadataJson = {
  background_color: "#FFFFFF",
  heading_text_color: "#1A1F2C",
  body_text_color: "#333333",
  action_text_color: "#FFFFFF",
  button_bg_color_1: "#6A0DAD",
  button_bg_color_2: "#8B5CF6",
  button_text_color_1: "#FFFFFF",
  button_text_color_2: "#FFFFFF",
  brand_tone: "professional",
  email_verified: false,
  phone_verified: false,
  uses_default_logo: true,
  default_logo_id: "default1"
};

// Define available default logos
export const DEFAULT_LOGOS = [
  { id: "default1", name: "סלון יופי", path: "/logos/salon-logo.png" },
  { id: "default2", name: "קוסמטיקה", path: "/logos/cosmetics-logo.png" },
  { id: "default3", name: "טיפוח", path: "/logos/spa-logo.png" },
  { id: "default4", name: "ציפורניים", path: "/logos/nails-logo.png" },
  { id: "default5", name: "אף אחד (טקסט בלבד)", path: "" }
];
