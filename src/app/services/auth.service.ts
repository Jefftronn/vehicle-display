import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private tokenKey = 'authToken'
  private authStatus = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient, private router: Router) { }

  public login(username: string, password: string): Observable<any> {
    return this.http.post<any>('https://you-api.com/api/login', { username, password }).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.token);
        this.authStatus.next(true);
      })
    )
  }

  public logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.authStatus.next(false);
    this.router.navigate(['/login'])
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
}

