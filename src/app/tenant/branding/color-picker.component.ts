import {
  Component,
  input,
  output,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  TenantBranding,
  COLOR_PRESETS,
  FONT_OPTIONS,
  DEFAULT_BRANDING,
} from '../shared/tenant.model';

@Component({
  selector: 'app-color-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './color-picker.component.html',
  styleUrl: './color-picker.component.scss',
})
export class ColorPickerComponent implements OnInit {
  initialBranding = input<TenantBranding>(DEFAULT_BRANDING);
  brandingChange = output<TenantBranding>();

  branding = signal<TenantBranding>({ ...DEFAULT_BRANDING });

  presets = COLOR_PRESETS;
  fontOptions = FONT_OPTIONS;

  previewText = computed(() => {
    const b = this.branding();
    return `font-family: '${b.fontFamily}', sans-serif; background: ${b.backgroundColor}; color: ${b.textColor};`;
  });

  ngOnInit(): void {
    this.branding.set({ ...this.initialBranding() });
  }

  applyPreset(preset: (typeof COLOR_PRESETS)[number]): void {
    this.patch({ primaryColor: preset.primary, secondaryColor: preset.secondary });
  }

  patch(changes: Partial<TenantBranding>): void {
    this.branding.update((b) => ({ ...b, ...changes }));
    this.brandingChange.emit(this.branding());
  }

  randomize(): void {
    const rand = () =>
      '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
    this.patch({ primaryColor: rand(), secondaryColor: rand() });
  }

  reset(): void {
    this.branding.set({ ...DEFAULT_BRANDING });
    this.brandingChange.emit(this.branding());
  }

  contrastColor(hex: string): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#1C1009' : '#FFFFFF';
  }
}
