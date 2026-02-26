import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { ErrorHandler, Injectable } from "@angular/core";
import { BehaviorSubject, catchError, map, throwError, finalize } from "rxjs";
import { StatsResponse } from "../models/stats-response.model";

@Injectable({ providedIn:'root' })

export class StatsService {
    private baseApiUrl = "https://f1api.dev"
    private teamUrl = "/api/current/drivers-championship"

    private statsLoadingSubject = new BehaviorSubject<boolean>(false);
    statsLoading$ = this.statsLoadingSubject.asObservable();
    private statsErrorSubject = new BehaviorSubject<string | null>(null);
    statsError = this.statsErrorSubject.asObservable();

    constructor(private http: HttpClient) {}

    getSeasonStats() {
        this.statsLoadingSubject.next(true);
        this.statsErrorSubject.next(null);
        return this.http.get<StatsResponse>(this.baseApiUrl + this.teamUrl).pipe(
        catchError((error: HttpErrorResponse) => {
            let message = 'Failed to load season stats';

            if (error.status === 0) {
            message = 'Network error';
            } else if (error.status >= 500) {
            message = 'Server error';
            }

            this.statsErrorSubject.next(message);
            return throwError(() => new Error(message));
        }),
        finalize(() => this.statsLoadingSubject.next(false))
        )
    }
}