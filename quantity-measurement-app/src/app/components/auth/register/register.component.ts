import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LoginDto } from '../../../models/measurement.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page animate-fade">
      <div class="auth-card card">

        <div class="auth-brand">⚖</div>

        <h2 class="auth-title">Create account</h2>
        <p class="auth-sub">Register to track your measurement history.</p>

        <div class="divider"></div>

        <div class="auth-form" *ngIf="!success">
          <div class="form-group">
            <label class="form-label">Username</label>
            <input
              type="text"
              class="form-control"
              [(ngModel)]="dto.username"
              placeholder="choose_a_username"
              autocomplete="username"
              (keyup.enter)="register()">
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <div class="password-wrap">
              <input
                [type]="showPw ? 'text' : 'password'"
                class="form-control"
                [(ngModel)]="dto.password"
                placeholder="••••••••"
                autocomplete="new-password"
                (keyup.enter)="register()">
              <button class="pw-toggle" (click)="showPw = !showPw" type="button">
                {{ showPw ? '🙈' : '👁' }}
              </button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Confirm Password</label>
            <input
              [type]="showPw ? 'text' : 'password'"
              class="form-control"
              [(ngModel)]="confirmPassword"
              placeholder="••••••••"
              (keyup.enter)="register()">
          </div>

          <div class="alert alert-danger" *ngIf="error">{{ error }}</div>

          <button
            class="btn btn-primary full-btn"
            (click)="register()"
            [disabled]="loading">
            <span *ngIf="loading" class="spinner"></span>
            {{ loading ? 'Creating account…' : 'Create account' }}
          </button>
        </div>

        <!-- Success state -->
        <div class="success-state" *ngIf="success">
          <div class="success-icon">✓</div>
          <h3>Account created!</h3>
          <p>You can now sign in with your credentials.</p>
          <a routerLink="/login" class="btn btn-primary full-btn mt-4">Go to Sign in →</a>
        </div>

        <div class="auth-footer" *ngIf="!success">
          Already have an account?
          <a routerLink="/login" class="auth-link">Sign in →</a>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .auth-page { max-width: 440px; margin: 40px auto; }
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
    }
    .auth-form { display: flex; flex-direction: column; gap: 16px; }

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

    .success-state {
      text-align: center;
      padding: 20px 0;
    }
    .success-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: var(--success-bg);
      border: 2px solid var(--success);
      color: var(--success);
      font-size: 1.8rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
    }
    .success-state h3 {
      font-size: 1.3rem;
      margin-bottom: 6px;
    }
    .success-state p { color: var(--text-secondary); font-size: 0.88rem; }
  `]
})
export class RegisterComponent {
  dto: LoginDto = { username: '', password: '' };
  confirmPassword = '';
  loading = false;
  error = '';
  showPw = false;
  success = false;

  constructor(private auth: AuthService, private router: Router) {
    if (this.auth.isLoggedIn) this.router.navigate(['/']);
  }

  register() {
    if (!this.dto.username || !this.dto.password) {
      this.error = 'Please fill in all fields.';
      return;
    }
    if (this.dto.password !== this.confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }
    if (this.dto.password.length < 4) {
      this.error = 'Password must be at least 4 characters.';
      return;
    }

    this.loading = true;
    this.error = '';

    this.auth.register(this.dto).subscribe({
      next: res => {
        this.loading = false;
        if (res.message?.toLowerCase().includes('success')) {
          this.success = true;
        } else {
          this.error = res.message ?? 'Registration failed.';
        }
      },
      error: err => {
        this.loading = false;
        this.error = err.error?.message ?? 'Registration failed.';
      }
    });
  }
}
