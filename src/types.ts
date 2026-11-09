export interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
  image: string;
}

export interface AppConfig {
  business_name: string;
  logo_text: string;
  accent_color: string;
  telegram_username: string;
  phone: string;
  address: string;
  hero_image: string;
  hero_title: string;
  hero_subtitle: string;
  services: Service[];
  working_hours: { start: string; end: string; slot_minutes?: number };
}

export interface BookingData {
  service: Service | null;
  carModel: string;
  plate: string;
  name: string;
  phone: string;
  comment: string;
  date: string | null;
  time: string | null;
}