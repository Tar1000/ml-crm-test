import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColorPickerComponent } from '../branding/color-picker.component';
import { PrinterManagerComponent } from '../printer/printer-manager.component';
import { TenantBranding, TenantSettings, DEFAULT_BRANDING } from '../shared/tenant.model';

type Tab = 'branding' | 'printers' | 'localization' | 'notifications' | 'advanced';

@Component({
  selector: 'app-tenant-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, ColorPickerComponent, PrinterManagerComponent],
  templateUrl: './tenant-settings.component.html',
  styleUrl: './tenant-settings.component.scss',
})
export class TenantSettingsComponent {
  activeTab = signal<Tab>('branding');

  tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'branding', label: 'Branding & Colors', icon: '🎨' },
    { id: 'printers', label: 'Printers', icon: '🖨' },
    { id: 'localization', label: 'Localization', icon: '🌍' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'advanced', label: 'Advanced', icon: '⚙️' },
  ];

  tenant = signal<TenantSettings>({
    id: crypto.randomUUID(),
    name: 'My Restaurant',
    subdomain: 'my-restaurant',
    branding: { ...DEFAULT_BRANDING },
    printers: [],
  });

  // Localization
  locale = signal({ timezone: 'UTC', currency: 'USD', language: 'en', dateFormat: 'MM/DD/YYYY' });
  timezones = ['UTC', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Asia/Dubai'];
  currencies = ['USD', 'EUR', 'GBP', 'AED', 'JPY', 'CAD', 'AUD'];
  languages = [{ value: 'en', label: 'English' }, { value: 'fr', label: 'Français' }, { value: 'es', label: 'Español' }, { value: 'ar', label: 'العربية' }];
  dateFormats = ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'];

  // Notifications
  notifications = signal({
    emailOnNewOrder: true,
    emailOnLowStock: true,
    smsOnNewOrder: false,
    whatsappReceipts: false,
    slackWebhook: '',
    dailyReportEmail: true,
  });

  // Advanced
  advanced = signal({
    maintenanceMode: false,
    orderPrefix: 'ORD-',
    invoicePrefix: 'INV-',
    taxRate: 10,
    serviceCharge: 0,
    allowGuestCheckout: true,
    requireTableNumber: true,
    autoConfirmOrders: false,
    sessionTimeout: 30,
    maxOrderItems: 50,
  });

  saved = signal(false);

  onBrandingChange(branding: TenantBranding): void {
    this.tenant.update((t) => ({ ...t, branding }));
  }

  save(): void {
    // In real app: call TenantService.update(this.tenant())
    console.log('Saving tenant settings', this.tenant());
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 2500);
  }
}
