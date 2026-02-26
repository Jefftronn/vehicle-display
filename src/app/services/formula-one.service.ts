import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, catchError, finalize, map, of } from "rxjs";
import { RaceTeam } from "../models/race-team.model";
import { TeamResponse } from "../models/team-response.model";
import { Driver } from "../models/driver.model";
import { DriverResponse } from "../models/driver-response.model";

@Injectable({
    providedIn:"root"
})

export class FormulaOneService {
    private baseApiUrl = "https://f1api.dev"
    private teamUrl = "/api/teams"

    private loadingSubject = new BehaviorSubject<boolean>(false); 
    loading$ = this.loadingSubject.asObservable();
    private errorSubject = new BehaviorSubject<string | null>(null);
    error$ = this.errorSubject.asObservable();

    constructor(private http: HttpClient) {}

    getAllTeams(): Observable<RaceTeam[]> {
        return this.http.get<TeamResponse>("https://f1api.dev/api/2026/teams").pipe(
            map(response => response.teams),
            catchError(() => {
                this.errorSubject.next('Failed to load teams');
                return of([]);
            }),
            finalize(() => this.loadingSubject.next(false))
        )

    }

    getAllDrivers(): Observable<Driver[]> {
        return this.http.get<DriverResponse>("https://f1api.dev/api/2026/drivers").pipe(
            map(response => response.drivers),
            catchError(() => {
                this.errorSubject.next('Failed to load drivers');
                return of([]);
            }),
            finalize(() => this.loadingSubject.next(false))
        )
    }

}