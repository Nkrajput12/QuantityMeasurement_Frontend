import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/measurement.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="navbar">
      <div class="navbar-inner">
        <a routerLink="/" class="brand">
          <span class="brand-icon">⚖</span>
          <span class="brand-text">QUANT<span class="brand-accent">MEASURE</span></span>
        </a>

        <div class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" class="nav-link">
            <span class="nav-icon">⇄</span> Converter
          </a>
          <a routerLink="/history" class="nav-link" [class.locked]="!isLoggedIn">
            <span class="nav-icon">{{ isLoggedIn ? '◷' : '🔒' }}</span> History
          </a>
        </div>

        <div class="nav-auth">
          <ng-container *ngIf="user; else guestTpl">
            <span class="user-chip">
              <span class="user-dot"></span>
              {{ user.username }}
            </span>
            <button class="btn btn-ghost btn-sm" (click)="logout()">Sign out</button>
          </ng-container>
          <ng-template #guestTpl>
            <a routerLink="/login" class="btn btn-ghost btn-sm">Sign in</a>
            <a routerLink="/register" class="btn btn-primary btn-sm">Register</a>
          </ng-template>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(13,13,15,0.88);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--border);
    }
    .navbar-inner {
      max-width: 960px;
      margin: 0 auto;
      padding: 0 24px;
      height: 60px;
      display: flex;
      align-items: center;
      gap: 32px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      flex-shrink: 0;
    }
    .brand-icon {
      font-size: 1.3rem;
      filter: sepia(1) saturate(5) hue-rotate(5deg);
    }
    .brand-text {
      font-family: var(--font-display);
      font-size: 1rem;
      font-weight: 800;
      letter-spacing: 0.05em;
      color: var(--text-primary);
    }
    .brand-accent { color: var(--amber); }

    .nav-links {
      display: flex;
      gap: 4px;
      flex: 1;
    }
    .nav-link {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: var(--radius);
      text-decoration: none;
      font-size: 0.85rem;
      color: var(--text-secondary);
      transition: all 0.2s;
      border: 1px solid transparent;
    }
    .nav-link:hover { color: var(--text-primary); background: var(--bg-elevated); }
    .nav-link.active {
      color: var(--amber);
      background: var(--amber-glow);
      border-color: rgba(245,158,11,0.2);
    }
    .nav-link.locked { opacity: 0.6; }
    .nav-icon { font-size: 0.9rem; }

    .nav-auth {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-left: auto;
    }
    .btn-sm { padding: 6px 14px; font-size: 0.8rem; }

    .user-chip {
      display: flex;
      align-items: center;
      gap: 7px;
      font-size: 0.82rem;
      color: var(--text-secondary);
      background: var(--bg-elevated);
      border: 1px solid var(--border);
      border-radius: 100px;
      padding: 4px 12px 4px 10px;
    }
    .user-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--success);
      box-shadow: 0 0 6px var(--success);
      flex-shrink: 0;
    }

    @media (max-width: 600px) {
      .navbar-inner { padding: 0 16px; gap: 12px; }
      .brand-text { font-size: 0.85rem; }
      .nav-link span:last-child { display: none; }
      .user-chip .username { display: none; }
    }
  `]
})
export class NavbarComponent implements OnInit {
  user: User | null = null;
  isLoggedIn = false;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.auth.user$.subscribe(u => {
      this.user = u;
      this.isLoggedIn = !!u;
    });
  }

  logout() {
    this.auth.logout();
  }
}
