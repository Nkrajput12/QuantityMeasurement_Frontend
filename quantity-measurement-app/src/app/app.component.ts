import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .main-content {
      max-width: 960px;
      margin: 0 auto;
      padding: 32px 24px 80px;
    }
    @media (max-width: 600px) {
      .main-content { padding: 20px 16px 60px; }
    }
  `]
})
export class AppComponent {}
