export type PaymentStatus = 'PAYMENT_PENDING' | 'CONFIRMED' | 'REJECTED';

export interface WorkshopRegistration {
  id: string;
  registration_id: string;
  full_name: string;
  mobile: string;
  whatsapp: string;
  email?: string;
  age_group: string;
  session: 'saturday' | 'sunday';
  craft_interests: string[];
  previous_experience: string;
  payment_status: PaymentStatus;
  utr?: string;
  screenshot_url?: string;
  amount: number;
  admin_notes?: string;
  verified_at?: string;
  created_at: string;
}

export interface WorkshopSettings {
  id: string;
  saturday_date: string;
  sunday_date: string;
  saturday_time: string;
  sunday_time: string;
  fee: number;
  max_seats_saturday: number;
  max_seats_sunday: number;
  registration_open: boolean;
  updated_at: string;
}

