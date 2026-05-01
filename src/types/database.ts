export type ActivityCategory = "CAVE" | "LAKE" | "SIGHTSEEING";
export type BookingStatus    = "PENDING" | "PAID" | "CANCELLED" | "CHECKED_IN";

export interface DbActivity {
  id:               string;
  name:             string;
  category:         ActivityCategory;
  description:      string | null;
  safety_guideline: string | null;
  difficulty_level: string | null;
  virtual_tour_url: string | null;
  max_capacity:     number;
  max_per_slot:     number;
  price:            number;
  is_active:        boolean;
  created_at:       string;
  updated_at:       string;
}

export interface DbActivitySlot {
  id:           string;
  activity_id:  string;
  slot_date:    string;   // "YYYY-MM-DD"
  slot_time:    string;   // "HH:MM:SS"
  booked_count: number;
}

export interface DbBooking {
  id:             string;
  user_id:        string | null;
  activity_id:    string;
  slot_id:        string | null;
  booking_date:   string;
  slot_time:      string;
  guest_count:    number;
  total_price:    number;
  status:         BookingStatus;
  qr_code_token:  string | null;
  guest_name:     string;
  guest_email:    string;
  guest_phone:    string;
  created_at:     string;
  updated_at:     string;
}

export interface DbWeatherLog {
  id:          number;
  location:    string;
  status:      string;
  description: string | null;
  temperature: number | null;
  is_safe:     boolean;
  updated_at:  string;
}
