import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrinterService } from './printer.service';
import { Printer } from '../shared/tenant.model';

const BLANK_PRINTER = (): Omit<Printer, 'id'> => ({
  name: '',
  type: 'thermal',
  connection: 'usb',
  paperSize: 'receipt-80mm',
  isDefault: false,
  isOnline: true,
  location: '',
});

@Component({
  selector: 'app-printer-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './printer-manager.component.html',
  styleUrl: './printer-manager.component.scss',
})
export class PrinterManagerComponent implements OnInit {
  showForm = signal(false);
  editingId = signal<string | null>(null);
  form = signal<Omit<Printer, 'id'>>(BLANK_PRINTER());
  testJobId = signal<string | null>(null);

  printerTypes: Printer['type'][] = ['thermal', 'inkjet', 'laser', 'dot-matrix'];
  connections: Printer['connection'][] = ['usb', 'network', 'bluetooth', 'cloud'];
  paperSizes: Printer['paperSize'][] = ['receipt-58mm', 'receipt-80mm', 'A4', 'A5', 'letter'];

  constructor(public printerService: PrinterService) {}

  ngOnInit(): void {
    // Seed demo printers on first load
    if (this.printerService.printers().length === 0) {
      this.printerService.loadPrinters([
        {
          id: crypto.randomUUID(),
          name: 'Front Counter Thermal',
          type: 'thermal',
          connection: 'usb',
          paperSize: 'receipt-80mm',
          isDefault: true,
          isOnline: true,
          dpi: 203,
          location: 'Front Counter',
        },
        {
          id: crypto.randomUUID(),
          name: 'Kitchen Ticket Printer',
          type: 'dot-matrix',
          connection: 'network',
          ipAddress: '192.168.1.50',
          port: 9100,
          paperSize: 'receipt-80mm',
          isDefault: false,
          isOnline: true,
          location: 'Kitchen',
        },
        {
          id: crypto.randomUUID(),
          name: 'Office Laser Printer',
          type: 'laser',
          connection: 'network',
          ipAddress: '192.168.1.20',
          paperSize: 'A4',
          isDefault: false,
          isOnline: false,
          location: 'Back Office',
        },
      ]);
    }
  }

  openAdd(): void {
    this.form.set(BLANK_PRINTER());
    this.editingId.set(null);
    this.showForm.set(true);
  }

  openEdit(printer: Printer): void {
    const { id, ...rest } = printer;
    this.form.set({ ...rest });
    this.editingId.set(id);
    this.showForm.set(true);
  }

  patchForm(changes: Partial<Omit<Printer, 'id'>>): void {
    this.form.update((f) => ({ ...f, ...changes }));
  }

  save(): void {
    const id = this.editingId();
    if (id) {
      this.printerService.updatePrinter(id, this.form());
    } else {
      this.printerService.addPrinter({ id: crypto.randomUUID(), ...this.form() });
    }
    this.showForm.set(false);
  }

  cancel(): void {
    this.showForm.set(false);
  }

  remove(id: string): void {
    if (confirm('Remove this printer?')) this.printerService.removePrinter(id);
  }

  testPrint(id: string): void {
    this.printerService.testPrint(id);
  }

  connectionLabel(c: Printer['connection']): string {
    const map: Record<Printer['connection'], string> = {
      usb: 'USB', network: 'Network / LAN', bluetooth: 'Bluetooth', cloud: 'Cloud Print',
    };
    return map[c];
  }

  typeIcon(t: Printer['type']): string {
    const map: Record<Printer['type'], string> = {
      thermal: '🧾', inkjet: '🖨', laser: '🖨', 'dot-matrix': '🖨',
    };
    return map[t];
  }

  jobStatusClass(status: string): string {
    return { queued: 'badge-warn', printing: 'badge-info', done: 'badge-ok', failed: 'badge-err' }[status] ?? '';
  }
}
