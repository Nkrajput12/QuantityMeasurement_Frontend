import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MeasurementService } from '../../services/measurement.service';
import { MeasurementHistory } from '../../models/measurement.model';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="history-page animate-fade">

      <!-- Header -->
      <div class="page-header">
        <div>
          <div class="badge badge-amber mb-2">My History</div>
          <h1 class="page-title">Calculation History</h1>
          <p class="page-sub">All your past operations, tracked and searchable.</p>
        </div>
        <div class="stats-pill" *ngIf="totalCount !== null">
          <span class="stats-num">{{ totalCount }}</span>
          <span class="stats-label">total operations</span>
        </div>
      </div>

      <!-- Filter bar -->
      <div class="filter-bar card">
        <div class="filter-group">
          <label class="form-label">Filter by Operation</label>
          <div class="filter-chips">
            <button
              class="chip"
              [class.active]="filterOp === ''"
              (click)="setFilter('')">All</button>
            <button
              *ngFor="let op of opTypes"
              class="chip"
              [class.active]="filterOp === op"
              (click)="setFilter(op)">{{ op }}</button>
          </div>
        </div>
        <button class="btn btn-secondary" (click)="reload()">
          <span>↺</span> Refresh
        </button>
      </div>

      <!-- Loading -->
      <div class="loading-wrap" *ngIf="loading">
        <div class="spinner" style="width:32px;height:32px;border-width:3px;"></div>
        <p class="text-secondary">Loading history…</p>
      </div>

      <!-- Error -->
      <div class="alert alert-danger" *ngIf="error && !loading">{{ error }}</div>

      <!-- Empty state -->
      <div class="empty-state" *ngIf="!loading && !error && history.length === 0">
        <div class="empty-icon">📭</div>
        <h3>No operations yet</h3>
        <p>Start converting measurements and they'll appear here.</p>
      </div>

      <!-- History List -->
      <div class="history-list" *ngIf="!loading && history.length > 0">
        <div
          class="history-card card animate-slide"
          *ngFor="let item of history; let i = index"
          [style.animation-delay]="(i * 40) + 'ms'">

          <div class="history-header">
            <div class="op-badge" [class]="'op-' + item.operationType.toLowerCase()">
              <span class="op-sym">{{ opSymbol(item.operationType) }}</span>
              {{ item.operationType }}
            </div>
            <span class="timestamp">{{ item.timestamp | date:'MMM d, y · h:mm a' }}</span>
          </div>

          <div class="history-body">
            <div class="history-detail">
              <span class="detail-label">Input</span>
              <span class="detail-value">{{ item.inputDetails }}</span>
            </div>
            <div class="arrow-sep">→</div>
            <div class="history-detail">
              <span class="detail-label">Result</span>
              <span class="detail-value result-highlight">{{ item.result }}</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  `,
  styles: [`
    .history-page { max-width: 720px; margin: 0 auto; }

    .page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 28px;
    }
    .page-title {
      font-size: 2rem;
      font-weight: 800;
      margin-bottom: 6px;
    }
    .page-sub { color: var(--text-secondary); font-size: 0.9rem; }

    .stats-pill {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 12px 20px;
      flex-shrink: 0;
    }
    .stats-num {
      font-family: var(--font-display);
      font-size: 2rem;
      font-weight: 800;
      color: var(--amber);
      line-height: 1;
    }
    .stats-label { font-size: 0.72rem; color: var(--text-muted); letter-spacing: 0.05em; }

    .filter-bar {
      display: flex;
      align-items: flex-end;
      gap: 16px;
      justify-content: space-between;
      padding: 18px 20px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    .filter-group { display: flex; flex-direction: column; gap: 8px; }
    .filter-chips { display: flex; gap: 6px; flex-wrap: wrap; }
    .chip {
      padding: 5px 14px;
      border-radius: 100px;
      border: 1px solid var(--border);
      background: var(--bg-secondary);
      color: var(--text-secondary);
      font-family: var(--font-mono);
      font-size: 0.78rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .chip:hover { border-color: var(--amber); color: var(--text-primary); }
    .chip.active {
      background: var(--amber-glow);
      border-color: var(--amber);
      color: var(--amber);
      font-weight: 600;
    }

    .loading-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 60px 0;
    }

    .empty-state {
      text-align: center;
      padding: 80px 20px;
      color: var(--text-secondary);
    }
    .empty-icon { font-size: 3rem; margin-bottom: 16px; }
    .empty-state h3 { font-size: 1.2rem; color: var(--text-primary); margin-bottom: 8px; }

    .history-list { display: flex; flex-direction: column; gap: 12px; }

    .history-card {
      padding: 18px 20px;
      transition: border-color 0.2s, transform 0.2s;
    }
    .history-card:hover {
      border-color: rgba(245,158,11,0.3);
      transform: translateX(4px);
    }

    .history-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }
    .op-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      border-radius: 100px;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      background: var(--bg-elevated);
      border: 1px solid var(--border);
      color: var(--text-secondary);
    }
    .op-convert { color: var(--amber); background: var(--amber-glow); border-color: rgba(245,158,11,0.3); }
    .op-add { color: var(--success); background: var(--success-bg); border-color: rgba(16,185,129,0.3); }
    .op-subtract { color: #f87171; background: rgba(248,113,113,0.1); border-color: rgba(248,113,113,0.3); }
    .op-divide { color: #a78bfa; background: rgba(167,139,250,0.1); border-color: rgba(167,139,250,0.3); }
    .op-compare { color: var(--info); background: rgba(96,165,250,0.1); border-color: rgba(96,165,250,0.3); }
    .op-sym { font-size: 0.9rem; }

    .timestamp { font-size: 0.75rem; color: var(--text-muted); }

    .history-body {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }
    .history-detail { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 120px; }
    .detail-label { font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); }
    .detail-value {
      font-family: var(--font-mono);
      font-size: 0.88rem;
      color: var(--text-primary);
      word-break: break-all;
    }
    .result-highlight { color: var(--amber); font-weight: 500; }
    .arrow-sep { color: var(--text-muted); font-size: 1.2rem; flex-shrink: 0; }

    @media (max-width: 600px) {
      .page-header { flex-direction: column; }
      .stats-pill { align-items: flex-start; }
      .filter-bar { flex-direction: column; align-items: flex-start; }
    }
  `]
})
export class HistoryComponent implements OnInit {
  history: MeasurementHistory[] = [];
  loading = false;
  error = '';
  filterOp = '';
  totalCount: number | null = null;

  opTypes = ['Convert', 'Add', 'Subtract', 'Divide', 'Compare'];

  constructor(private measurementService: MeasurementService) {}

  ngOnInit() {
    this.loadHistory();
    this.loadCount();
  }

  loadHistory() {
    this.loading = true;
    this.error = '';

    const obs$ = this.filterOp
      ? this.measurementService.getHistoryByOperation(this.filterOp)
      : this.measurementService.getHistory();

    obs$.subscribe({
      next: data => {
        this.history = data;
        this.loading = false;
      },
      error: err => {
        this.error = err.error?.message ?? 'Failed to load history.';
        this.loading = false;
      }
    });
  }

  loadCount() {
    this.measurementService.getOperationCount().subscribe({
      next: count => this.totalCount = count,
      error: () => {}
    });
  }

  setFilter(op: string) {
    this.filterOp = op;
    this.loadHistory();
  }

  reload() {
    this.loadHistory();
    this.loadCount();
  }

  opSymbol(op: string): string {
    return {
      convert: '⇄', add: '+', subtract: '−', divide: '÷', compare: '='
    }[op.toLowerCase()] ?? '•';
  }
}
