import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { tap, catchError } from "rxjs";
import { environment } from "../../environments/environment";

export interface UserProfile {
  username: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private tokenKey = 'authToken'
  private profileKey = 'userProfile'
  private authStatus = new BehaviorSubject<boolean>(this.hasToken());
  private baseUrl = environment.apiBaseUrl;
  private profileSubject = new BehaviorSubject<UserProfile | null>(this.loadProfileFromStorage());

  constructor(private http: HttpClient, private router: Router) {

  }

  public login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Auth/login`, { username, password }).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.token);
        this.authStatus.next(true);
        // store username from login parameter
        const profile: UserProfile = { username, email: response.user.username, role: response.user.role || '' };
        localStorage.setItem(this.profileKey, JSON.stringify(profile));
        this.profileSubject.next(profile);
      }),
      catchError(this.handleError) // <-- handle errors here
    )
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

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Network error: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code
      if (error.status === 401) {
        errorMessage = 'Invalid username or password.';
      } else if (error.status === 0) {
        errorMessage = 'Cannot connect to server.';
      } else {
        errorMessage = `Server error (${error.status}): ${error.message}`;
      }
    }
    return throwError(() => new Error(errorMessage));
  }
}

