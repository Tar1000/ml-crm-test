import { Injectable, signal, computed } from '@angular/core';
import { Printer, PrintJob } from '../shared/tenant.model';

@Injectable({ providedIn: 'root' })
export class PrinterService {
  private _printers = signal<Printer[]>([]);
  private _jobs = signal<PrintJob[]>([]);

  printers = this._printers.asReadonly();
  jobs = this._jobs.asReadonly();

  defaultPrinter = computed(() =>
    this._printers().find((p) => p.isDefault) ?? null
  );

  onlinePrinters = computed(() => this._printers().filter((p) => p.isOnline));

  loadPrinters(printers: Printer[]): void {
    this._printers.set(printers);
  }

  addPrinter(printer: Printer): void {
    if (printer.isDefault) {
      this._printers.update((list) =>
        list.map((p) => ({ ...p, isDefault: false }))
      );
    }
    this._printers.update((list) => [...list, printer]);
  }

  updatePrinter(id: string, changes: Partial<Printer>): void {
    if (changes.isDefault) {
      this._printers.update((list) =>
        list.map((p) => ({ ...p, isDefault: false }))
      );
    }
    this._printers.update((list) =>
      list.map((p) => (p.id === id ? { ...p, ...changes } : p))
    );
  }

  removePrinter(id: string): void {
    this._printers.update((list) => list.filter((p) => p.id !== id));
  }

  setDefault(id: string): void {
    this._printers.update((list) =>
      list.map((p) => ({ ...p, isDefault: p.id === id }))
    );
  }

  print(
    documentType: PrintJob['documentType'],
    documentName: string,
    printerId?: string,
    copies = 1
  ): string {
    const targetId =
      printerId ?? this.defaultPrinter()?.id;
    if (!targetId) throw new Error('No printer selected or set as default.');

    const job: PrintJob = {
      id: crypto.randomUUID(),
      printerId: targetId,
      documentType,
      documentName,
      copies,
      status: 'queued',
      createdAt: new Date(),
    };

    this._jobs.update((list) => [job, ...list]);
    this.simulatePrint(job.id);
    return job.id;
  }

  private simulatePrint(jobId: string): void {
    setTimeout(() => {
      this._jobs.update((list) =>
        list.map((j) => (j.id === jobId ? { ...j, status: 'printing' } : j))
      );
    }, 600);

    setTimeout(() => {
      this._jobs.update((list) =>
        list.map((j) => (j.id === jobId ? { ...j, status: 'done' } : j))
      );
    }, 2200);
  }

  clearCompletedJobs(): void {
    this._jobs.update((list) =>
      list.filter((j) => j.status !== 'done' && j.status !== 'failed')
    );
  }

  testPrint(printerId: string): void {
    this.print('receipt', 'Test Page', printerId, 1);
  }
}
