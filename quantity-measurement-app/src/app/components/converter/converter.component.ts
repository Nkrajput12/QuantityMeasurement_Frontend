import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MeasurementService } from '../../services/measurement.service';
import { AuthService } from '../../services/auth.service';
import { MeasurementApiRequest, UNITS, CATEGORIES, OPERATIONS } from '../../models/measurement.model';

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="converter-page animate-fade">

      <!-- Hero -->
      <div class="hero">
        <div class="hero-badge badge badge-amber">Unit Converter</div>
        <h1 class="hero-title">Measure <span class="text-amber">anything</span>,<br>convert everything.</h1>
        <p class="hero-sub">Length · Weight · Volume · Temperature — no login required.</p>
      </div>

      <!-- Operation Tabs -->
      <div class="op-tabs">
        <button
          *ngFor="let op of operations"
          class="op-tab"
          [class.active]="selectedOp === op.key"
          (click)="selectOperation(op.key)">
          <span class="op-icon">{{ op.icon }}</span>
          <span class="op-label">{{ op.label }}</span>
        </button>
      </div>

      <!-- Main Card -->
      <div class="card converter-card">

        <!-- Category selector -->
        <div class="category-row">
          <button
            *ngFor="let cat of categories"
            class="cat-btn"
            [class.active]="category === cat"
            (click)="selectCategory(cat)">
            <span class="cat-emoji">{{ categoryEmoji(cat) }}</span>
            <span>{{ cat | titlecase }}</span>
          </button>
        </div>

        <div class="divider"></div>

        <!-- Input Section -->
        <div class="input-section">

          <!-- Value 1 -->
          <div class="value-block">
            <label class="form-label">{{ currentOp.needsTwo ? 'First Value' : 'Value' }}</label>
            <div class="value-row">
              <input
                type="number"
                class="form-control value-input"
                [(ngModel)]="val1Amount"
                placeholder="0"
                (input)="clearResult()">
              <select class="form-control unit-select" [(ngModel)]="val1Unit" (change)="clearResult()">
                <option *ngFor="let u of unitList" [value]="u">{{ u }}</option>
              </select>
            </div>
          </div>

          <!-- Value 2 (conditional) -->
          <div class="value-block" *ngIf="currentOp.needsTwo">
            <label class="form-label">Second Value</label>
            <div class="value-row">
              <input
                type="number"
                class="form-control value-input"
                [(ngModel)]="val2Amount"
                placeholder="0"
                (input)="clearResult()">
              <select class="form-control unit-select" [(ngModel)]="val2Unit" (change)="clearResult()">
                <option *ngFor="let u of unitList" [value]="u">{{ u }}</option>
              </select>
            </div>
          </div>

          <!-- Target Unit (conditional) -->
          <div class="form-group" *ngIf="currentOp.needsTarget">
            <label class="form-label">Convert to</label>
            <select class="form-control" [(ngModel)]="targetUnit" (change)="clearResult()">
              <option *ngFor="let u of unitList" [value]="u">{{ u }}</option>
            </select>
          </div>

        </div>

        <!-- Action Button -->
        <button
          class="btn btn-primary calculate-btn"
          (click)="calculate()"
          [disabled]="loading">
          <span *ngIf="loading" class="spinner"></span>
          <span *ngIf="!loading">{{ currentOp.icon }}</span>
          {{ loading ? 'Calculating...' : 'Calculate' }}
        </button>

        <!-- Error -->
        <div class="alert alert-danger mt-4" *ngIf="error">
          {{ error }}
        </div>

        <!-- Result -->
        <div class="result-box mt-4" *ngIf="result !== null && !error">
          <div class="result-label">Result</div>

          <!-- Compare result -->
          <ng-container *ngIf="selectedOp === 'compare'">
            <div class="compare-result" [class.equal]="result === true">
              <span class="compare-icon">{{ result === true ? '✓' : '✗' }}</span>
              <span class="compare-text">{{ result === true ? 'They are equal' : 'They are not equal' }}</span>
            </div>
          </ng-container>

          <!-- Divide result -->
          <ng-container *ngIf="selectedOp === 'divide'">
            <div class="result-value">
              {{ result?.result ?? result }}
              <span class="result-unit">(ratio)</span>
            </div>
          </ng-container>

          <!-- Convert / Add / Subtract result -->
          <ng-container *ngIf="selectedOp !== 'compare' && selectedOp !== 'divide'">
            <div class="result-value" *ngIf="result?.value !== undefined">
              {{ result.value | number:'1.2-6' }}
              <span class="result-unit">{{ result.unit }}</span>
            </div>
            <div class="result-value" *ngIf="result?.value === undefined && result !== null">
              {{ result | json }}
            </div>
          </ng-container>
        </div>

        <!-- Guest note -->
        <div class="guest-note mt-4" *ngIf="!isLoggedIn && result !== null">
          <span class="lock-icon">🔒</span>
          <span>
            <a routerLink="/login" class="amber-link">Sign in</a> to save and track your calculation history.
          </span>
        </div>

      </div>

      <!-- Info strip -->
      <div class="info-strip">
        <div class="info-item">
          <span class="info-icon">⚡</span>
          <span>Instant conversion with no rate limits</span>
        </div>
        <div class="info-item">
          <span class="info-icon">🔓</span>
          <span>No account needed to convert</span>
        </div>
        <div class="info-item">
          <span class="info-icon">📋</span>
          <span>Login to save history</span>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .converter-page { max-width: 640px; margin: 0 auto; }

    .hero { text-align: center; margin-bottom: 40px; }
    .hero-badge { margin-bottom: 16px; }
    .hero-title {
      font-size: 2.6rem;
      font-weight: 800;
      line-height: 1.15;
      margin-bottom: 12px;
    }
    .hero-sub { color: var(--text-secondary); font-size: 0.95rem; }

    .op-tabs {
      display: flex;
      gap: 6px;
      margin-bottom: 20px;
      overflow-x: auto;
      padding-bottom: 4px;
    }
    .op-tabs::-webkit-scrollbar { display: none; }
    .op-tab {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 100px;
      color: var(--text-secondary);
      font-family: var(--font-mono);
      font-size: 0.82rem;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
    }
    .op-tab:hover { border-color: var(--amber); color: var(--text-primary); }
    .op-tab.active {
      background: var(--amber-glow);
      border-color: var(--amber);
      color: var(--amber);
    }
    .op-icon { font-size: 1rem; font-weight: 700; }

    .converter-card { padding: 28px; }

    .category-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .cat-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 7px 14px;
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      color: var(--text-secondary);
      font-family: var(--font-mono);
      font-size: 0.82rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .cat-btn:hover { border-color: var(--border-active); color: var(--text-primary); }
    .cat-btn.active {
      background: var(--amber-glow);
      border-color: var(--amber);
      color: var(--amber);
      font-weight: 600;
    }
    .cat-emoji { font-size: 1rem; }

    .input-section { display: flex; flex-direction: column; gap: 16px; margin-bottom: 20px; }

    .value-block { display: flex; flex-direction: column; gap: 6px; }
    .value-row { display: grid; grid-template-columns: 1fr auto; gap: 10px; }
    .value-input { font-size: 1.1rem; font-weight: 500; }
    .unit-select { width: 140px; flex-shrink: 0; }

    .calculate-btn {
      width: 100%;
      justify-content: center;
      padding: 14px;
      font-size: 0.95rem;
      font-weight: 600;
      letter-spacing: 0.04em;
    }

    .compare-result {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 1.4rem;
    }
    .compare-result .compare-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--danger-bg);
      color: var(--danger);
      font-size: 1.2rem;
      border: 1px solid rgba(239,68,68,0.3);
    }
    .compare-result.equal .compare-icon {
      background: var(--success-bg);
      color: var(--success);
      border-color: rgba(16,185,129,0.3);
    }
    .compare-text { font-family: var(--font-display); font-size: 1.2rem; }

    .guest-note {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      background: var(--bg-elevated);
      border: 1px dashed var(--border);
      border-radius: var(--radius);
      font-size: 0.82rem;
      color: var(--text-secondary);
    }
    .amber-link { color: var(--amber); text-decoration: none; }
    .amber-link:hover { text-decoration: underline; }

    .info-strip {
      display: flex;
      gap: 0;
      margin-top: 28px;
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      overflow: hidden;
    }
    .info-item {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 14px 16px;
      font-size: 0.78rem;
      color: var(--text-secondary);
      background: var(--bg-card);
      border-right: 1px solid var(--border);
    }
    .info-item:last-child { border-right: none; }
    .info-icon { font-size: 1rem; }

    @media (max-width: 600px) {
      .hero-title { font-size: 1.8rem; }
      .unit-select { width: 110px; }
      .info-strip { flex-direction: column; }
      .info-item { border-right: none; border-bottom: 1px solid var(--border); }
      .info-item:last-child { border-bottom: none; }
    }
  `]
})
export class ConverterComponent implements OnInit {
  categories = CATEGORIES;
  operations = OPERATIONS;

  category = 'length';
  selectedOp = 'convert';
  currentOp = OPERATIONS[0];

  unitList: string[] = [];
  val1Amount: number | null = null;
  val1Unit = '';
  val2Amount: number | null = null;
  val2Unit = '';
  targetUnit = '';

  result: any = null;
  error = '';
  loading = false;
  isLoggedIn = false;

  constructor(
    private measurementService: MeasurementService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.auth.user$.subscribe(u => this.isLoggedIn = !!u);
    this.selectCategory(this.category);
  }

  categoryEmoji(cat: string): string {
    return { length: '📏', weight: '⚖️', volume: '🧪', temperature: '🌡️' }[cat] ?? '📐';
  }

  selectCategory(cat: string) {
    this.category = cat;
    this.unitList = UNITS[cat];
    this.val1Unit = this.unitList[0];
    this.val2Unit = this.unitList[1] ?? this.unitList[0];
    this.targetUnit = this.unitList[1] ?? this.unitList[0];
    this.clearResult();
  }

  selectOperation(op: string) {
    this.selectedOp = op;
    this.currentOp = OPERATIONS.find(o => o.key === op) ?? OPERATIONS[0];
    this.clearResult();
  }

  clearResult() {
    this.result = null;
    this.error = '';
  }

  calculate() {
    if (this.val1Amount === null || this.val1Amount === undefined) {
      this.error = 'Please enter a value.';
      return;
    }

    const req: MeasurementApiRequest = {
      category: this.category,
      value1: { value: this.val1Amount, unit: this.val1Unit },
      value2: this.currentOp.needsTwo && this.val2Amount !== null
        ? { value: this.val2Amount!, unit: this.val2Unit }
        : undefined,
      targetUnit: this.currentOp.needsTarget ? this.targetUnit : undefined
    };

    this.loading = true;
    this.error = '';
    this.result = null;

    const call$ = {
      convert: this.measurementService.convert(req),
      add: this.measurementService.add(req),
      subtract: this.measurementService.subtract(req),
      divide: this.measurementService.divide(req),
      compare: this.measurementService.compare(req)
    }[this.selectedOp];

    call$?.subscribe({
      next: res => {
        this.loading = false;
        if (this.selectedOp === 'compare') {
          this.result = res.areEqual ?? res.AreEqual;
        } else {
          this.result = res;
        }
      },
      error: err => {
        this.loading = false;
        this.error = err.error?.message ?? err.message ?? 'Something went wrong.';
      }
    });
  }
}
