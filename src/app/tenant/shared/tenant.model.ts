export interface TenantBranding {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  logoUrl?: string;
  fontFamily: string;
  darkMode: boolean;
  receiptTemplate: 'classic' | 'modern' | 'minimal';
  borderRadius: 'sharp' | 'rounded' | 'pill';
}

export interface Printer {
  id: string;
  name: string;
  type: 'thermal' | 'inkjet' | 'laser' | 'dot-matrix';
  connection: 'usb' | 'network' | 'bluetooth' | 'cloud';
  ipAddress?: string;
  port?: number;
  paperSize: 'A4' | 'A5' | 'receipt-58mm' | 'receipt-80mm' | 'letter';
  isDefault: boolean;
  isOnline: boolean;
  dpi?: number;
  location?: string;
}

export interface PrintJob {
  id: string;
  printerId: string;
  documentType: 'receipt' | 'invoice' | 'report' | 'label' | 'order';
  documentName: string;
  copies: number;
  status: 'queued' | 'printing' | 'done' | 'failed';
  createdAt: Date;
}

export interface TenantSettings {
  id: string;
  name: string;
  subdomain: string;
  branding: TenantBranding;
  printers: Printer[];
  defaultPrinterId?: string;
}

export const DEFAULT_BRANDING: TenantBranding = {
  primaryColor: '#8B1A1A',
  secondaryColor: '#E8A020',
  accentColor: '#2D6A4F',
  backgroundColor: '#FAF7F2',
  textColor: '#1C1009',
  fontFamily: 'Inter',
  darkMode: false,
  receiptTemplate: 'modern',
  borderRadius: 'rounded',
};

export const FONT_OPTIONS = [
  { value: 'Inter', label: 'Inter (Modern)' },
  { value: 'Roboto', label: 'Roboto (Clean)' },
  { value: 'Playfair Display', label: 'Playfair Display (Elegant)' },
  { value: 'Lato', label: 'Lato (Friendly)' },
  { value: 'Montserrat', label: 'Montserrat (Bold)' },
  { value: 'Merriweather', label: 'Merriweather (Classic)' },
];

export const COLOR_PRESETS = [
  { name: 'Warm & Appetizing', primary: '#8B1A1A', secondary: '#E8A020' },
  { name: 'Modern & Premium', primary: '#1A1A1A', secondary: '#C9A84C' },
  { name: 'Fresh & Healthy', primary: '#2D6A4F', secondary: '#F4C430' },
  { name: 'Bold & Fast-Casual', primary: '#D63031', secondary: '#FF7043' },
  { name: 'Ocean Blue', primary: '#0077B6', secondary: '#90E0EF' },
  { name: 'Royal Purple', primary: '#5A189A', secondary: '#E040FB' },
];
