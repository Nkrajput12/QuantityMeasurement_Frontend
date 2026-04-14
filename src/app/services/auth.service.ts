import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginDto, AuthResponse, User } from '../models/measurement.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = `${environment.apiUrl}/api/Auth`;
  private userSubject = new BehaviorSubject<User | null>(this.loadUser());
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  private loadUser(): User | null {
    try {
      const raw = localStorage.getItem('qm_user');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }

  get currentUser(): User | null {
    return this.userSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  get token(): string | null {
    return this.currentUser?.token ?? null;
  }

  login(dto: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API}/Login`, dto).pipe(
      tap(res => {
        if (res.token && res.user) {
          const user: User = { username: res.user, token: res.token };
          localStorage.setItem('qm_user', JSON.stringify(user));
          this.userSubject.next(user);
        }
      })
    );
  }

  register(dto: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API}/Register`, dto);
  }

  logout(): void {
    localStorage.removeItem('qm_user');
    this.userSubject.next(null);
  }
}
