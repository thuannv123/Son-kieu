export type ActivityCategory = "CAVE" | "LAKE" | "SIGHTSEEING" | "DINING";
export type DifficultyLevel  = "Dễ" | "Trung bình" | "Khó";
export type BookingStatus    = "PENDING" | "PAID" | "CANCELLED" | "CHECKED_IN";

export interface Activity {
  id:              string;
  slug?:           string;
  name:            string;
  category:        ActivityCategory;
  description:     string;
  safetyGuideline: string;
  difficultyLevel?: DifficultyLevel;
  virtualTourUrl?:  string;
  price:           number;
  maxCapacity:     number;
  maxPerSlot:      number;
  coverGradient:   string;
  image_url?:      string;
  rating:          number;
  reviewCount:     number;
  highlights:      string[];
  durationMinutes: number;
}

export interface TimeSlot {
  id:        string;
  time:      string;      // "08:00"
  available: number;
  total:     number;
}

export interface ActivitySelection {
  activityId: string;
  date:       string;
  slotTime:   string;
}

export interface BookingFormData {
  selections: ActivitySelection[];
  guestCount: number;
  guestName:  string;
  guestEmail: string;
  guestPhone: string;
}

export interface BookingConfirmation {
  id:           string;
  qrCodeToken:  string;
  activityName: string;
  date:         string;
  slotTime:     string;
  guestCount:   number;
  totalPrice:   number;
  status:       BookingStatus;
}
