import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, throwError, switchMap } from "rxjs";
import { tap, catchError } from "rxjs";
import { environment } from "../../environments/environment";

export interface UserProfile {
  username: string;
  userRole: string;
  userID: number;
}

export interface ResetPasswordData extends UserProfile {
  fromLogin: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
  userType: number;
  ipAddress: string;
}
export interface ResetRequest {
  username: string;
  password: string;
  userType: number;
  ipAddress: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private tokenKey = 'authToken'
  private profileKey = 'userProfile'
  private expiresKey = 'tokenExpiresAtMs'
  private logoutTimer: any;
  private authStatus = new BehaviorSubject<boolean>(this.hasToken());
  private baseUrl = environment.apiBaseUrl;
  private baseProxyUrl = '/api/auth/authenticate';
  private baseProxyPwResetUrl = '/api/auth/resetpw';
  private profileSubject = new BehaviorSubject<UserProfile | null>(this.loadProfileFromStorage());

  constructor(private http: HttpClient, private router: Router) {
    const profile = this.loadProfileFromStorage();
    const token = this.getToken();
    if (token && profile) {
      const expiry = localStorage.getItem(this.expiresKey);
      if (expiry) {
        const expiresInMs = +expiry - Date.now();
        if (expiresInMs > 0) {
          this.scheduleAutoLogout(expiresInMs);
        } else {
          this.logout();
        }
      }
    }
  }

  public login(username: string, password: string): Observable<any> {
    return this.getIPAddress().pipe(
      switchMap(res => {
        const loginRequest: LoginRequest = {
          username,
          password,
          userType: 3,
          ipAddress: res.ip
        };

        return this.http.post<any>(this.baseProxyUrl, loginRequest).pipe(
          tap(response => {
            localStorage.setItem(this.tokenKey, response.jwtToken);
            const profile: UserProfile = {
              username: response.username,
              userID: response.userID,
              userRole: response.userRole
            };
            localStorage.setItem(this.profileKey, JSON.stringify(profile));
            this.profileSubject.next(profile);

            this.authStatus.next(true);

            const expiryTimestamp = Date.now() + response.jwtTokenExpiresAt * 1000;
            localStorage.setItem(this.expiresKey, expiryTimestamp.toString());

            const expiresInMs = expiryTimestamp - Date.now();
            this.scheduleAutoLogout(expiresInMs);
          }),
          catchError(this.handleError)
        );
      })
    );
  }

  public resetPassword(username: string, password: string): Observable<any> {
    return this.getIPAddress().pipe(
      switchMap((ipResponse: any) => {
        const resetRequest: ResetRequest = {
          username: username,
          password: password,
          userType: 3,
          ipAddress: ipResponse.ip
        };
        return this.http.post<any>(`${this.baseProxyPwResetUrl}`, resetRequest).pipe(
          tap(() => {
            this.logout();
          }),
          catchError(this.handleError)
        );
      }),
      catchError(this.handleError)
    );
  }

  public logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.profileKey);
    this.authStatus.next(false);
    this.profileSubject.next(null);
    this.router.navigate(['/login'])
  }

  public getProfile(): Observable<UserProfile | null> {
    return this.profileSubject.asObservable();
  }

  private loadProfileFromStorage(): UserProfile | null {
    const stored = localStorage.getItem(this.profileKey);
    return stored ? JSON.parse(stored) : null;
  }

  public isLoggedIn(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  private getIPAddress(): Observable<{ ip: string }> {
    return this.http.get<{ ip: string }>('https://api.ipify.org?format=json').pipe(
      catchError(this.handleError)
    );
  }

  private scheduleAutoLogout(expiresInMs: number) {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }
    this.logoutTimer = setTimeout(() => {
      this.logout();
    }, expiresInMs)
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Network error: ${error.error.message}`;
    } else {
      if (error.status === 401) {
        errorMessage = error.error.response;
      } else if (error.status === 0) {
        errorMessage = 'Cannot connect to server.';
      } else {
        errorMessage = `Server error (${error.status}): ${error.message}`;
      }
    }
    return throwError(() => new Error(errorMessage));
  }
}

