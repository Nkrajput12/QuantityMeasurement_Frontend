import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LoginDto } from '../../../models/measurement.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page animate-fade">
      <div class="auth-card card">

        <!-- Brand mark -->
        <div class="auth-brand">
          <span class="brand-icon">⚖</span>
        </div>

        <h2 class="auth-title">Welcome back</h2>
        <p class="auth-sub">Sign in to access your measurement history.</p>

        <div class="divider"></div>

        <!-- Form -->
        <div class="auth-form">
          <div class="form-group">
            <label class="form-label">Username</label>
            <input
              type="text"
              class="form-control"
              [(ngModel)]="dto.username"
              placeholder="your_username"
              autocomplete="username"
              (keyup.enter)="login()">
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <div class="password-wrap">
              <input
                [type]="showPw ? 'text' : 'password'"
                class="form-control"
                [(ngModel)]="dto.password"
                placeholder="••••••••"
                autocomplete="current-password"
                (keyup.enter)="login()">
              <button class="pw-toggle" (click)="showPw = !showPw" type="button">
                {{ showPw ? '🙈' : '👁' }}
              </button>
            </div>
          </div>

          <!-- Error / Success -->
          <div class="alert alert-danger" *ngIf="error">{{ error }}</div>

          <button
            class="btn btn-primary full-btn"
            (click)="login()"
            [disabled]="loading">
            <span *ngIf="loading" class="spinner"></span>
            {{ loading ? 'Signing in…' : 'Sign in' }}
          </button>
        </div>

        <div class="auth-footer">
          Don't have an account?
          <a routerLink="/register" class="auth-link">Create one →</a>
        </div>

        <div class="guest-strip">
          <span>🔓</span>
          <span>You can <a routerLink="/" class="auth-link">use the converter</a> without signing in.</span>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      max-width: 440px;
      margin: 40px auto;
    }
    .auth-card { padding: 40px; }

    .auth-brand {
      font-size: 2.5rem;
      text-align: center;
      margin-bottom: 20px;
      filter: sepia(1) saturate(5) hue-rotate(5deg);
    }
    .auth-title {
      text-align: center;
      font-size: 1.8rem;
      font-weight: 800;
      margin-bottom: 6px;
    }
    .auth-sub {
      text-align: center;
      color: var(--text-secondary);
      font-size: 0.88rem;
      margin-bottom: 0;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .password-wrap { position: relative; }
    .password-wrap .form-control { padding-right: 44px; }
    .pw-toggle {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1rem;
      padding: 4px;
      line-height: 1;
    }

    .full-btn {
      width: 100%;
      justify-content: center;
      padding: 13px;
      font-size: 0.95rem;
      margin-top: 4px;
    }

    .auth-footer {
      text-align: center;
      margin-top: 20px;
      font-size: 0.85rem;
      color: var(--text-secondary);
    }
    .auth-link { color: var(--amber); text-decoration: none; }
    .auth-link:hover { text-decoration: underline; }

    .guest-strip {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 16px;
      padding: 12px 16px;
      background: var(--bg-elevated);
      border: 1px dashed var(--border);
      border-radius: var(--radius);
      font-size: 0.8rem;
      color: var(--text-secondary);
    }
  `]
})
export class LoginComponent {
  dto: LoginDto = { username: '', password: '' };
  loading = false;
  error = '';
  showPw = false;
  private returnUrl = '/history';

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] ?? '/history';
    if (this.auth.isLoggedIn) this.router.navigate([this.returnUrl]);
  }

  login() {
    if (!this.dto.username || !this.dto.password) {
      this.error = 'Please fill in all fields.';
      return;
    }
    this.loading = true;
    this.error = '';

    this.auth.login(this.dto).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate([this.returnUrl]);
      },
      error: err => {
        this.loading = false;
        this.error = err.error?.message ?? 'Login failed. Check your credentials.';
      }
    });
  }
}
