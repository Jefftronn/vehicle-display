import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable, throwError, of } from "rxjs";
import { catchError, finalize, delay } from "rxjs/operators";
import { CarRecord } from "../models/car-record.model";
import { CarReport } from "../models/car-report.model";

@Injectable({
  providedIn: 'root',
})

export class CarReportService {
  private carListSubject = new BehaviorSubject<CarReport[]>([]);
  public carList$ = this.carListSubject.asObservable();
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();
  private baseUrl = 'https://api.bumper.com/sandbox/v1/vehicle/full'; // <-- your API endpoint
  private apiKey = '';
  private baseProxyUrl = '/api-bumper/sandbox/v1/vehicle/full';
  private baseVinToPlateUrl = '/api-bumper/sandbox/v1/vehicle/vin_to_plate'

  constructor(private http: HttpClient) { }

  public getCarReports(vin: string): Observable<CarRecord> {
    const url = `${this.baseProxyUrl}?vin=${vin}`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`,        // sending key as header
      'Content-Type': 'application/json'
    });

    const proxyHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.get<CarRecord>(url, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  public loadCarReportList(useDummy: boolean = true): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    if (useDummy) {
      const dummyLists: CarReport[] = [
        { vin: '1HGBH41JXMN100001', make: "Tesla", model: "Model S", year: 2024, msrp: 120000, licensePlateState: "CA", yearRegistered: 2024, status: "new" },
        { vin: '1HGBH41JXMN100002', make: "BMW", model: "X5", year: 2023, msrp: 95000, licensePlateState: "NY", yearRegistered: 2023, status: "viewed" },
        { vin: '1HGBH41JXMN100003', make: "Mercedes", model: "S-Class", year: 2022, msrp: 140000, licensePlateState: "TX", yearRegistered: 2022, status: "action_taken" },
        { vin: '1HGBH41JXMN100004', make: "Audi", model: "Q7", year: 2021, msrp: 85000, licensePlateState: "FL", yearRegistered: 2021, status: "archived" },
        { vin: '1HGBH41JXMN100005', make: "Porsche", model: "Cayenne", year: 2020, msrp: 130000, licensePlateState: "NV", yearRegistered: 2020, status: "new" },
        { vin: '1HGBH41JXMN100006', make: "Lexus", model: "RX", year: 2024, msrp: 75000, licensePlateState: "IL", yearRegistered: 2024, status: "viewed" },
        { vin: '1HGBH41JXMN100007', make: "Toyota", model: "Land Cruiser", year: 2023, msrp: 95000, licensePlateState: "WA", yearRegistered: 2023, status: "new" },
        { vin: '1HGBH41JXMN100008', make: "Honda", model: "Pilot", year: 2022, msrp: 68000, licensePlateState: "NJ", yearRegistered: 2022, status: "archived" },
        { vin: '1HGBH41JXMN100009', make: "Ford", model: "F-150", year: 2024, msrp: 85000, licensePlateState: "OH", yearRegistered: 2024, status: "action_taken" },
        { vin: '1HGBH41JXMN100010', make: "Chevrolet", model: "Tahoe", year: 2023, msrp: 92000, licensePlateState: "MI", yearRegistered: 2023, status: "viewed" },
        { vin: '1HGBH41JXMN100011', make: "Nissan", model: "Rogue", year: 2021, msrp: 65000, licensePlateState: "GA", yearRegistered: 2021, status: "new" },
        { vin: '1HGBH41JXMN100012', make: "Hyundai", model: "Santa Fe", year: 2020, msrp: 62000, licensePlateState: "NC", yearRegistered: 2020, status: "archived" },
        { vin: '1HGBH41JXMN100013', make: "Kia", model: "Telluride", year: 2024, msrp: 78000, licensePlateState: "CO", yearRegistered: 2024, status: "new" },
        { vin: '1HGBH41JXMN100014', make: "Tesla", model: "Model Y", year: 2022, msrp: 90000, licensePlateState: "CA", yearRegistered: 2022, status: "viewed" },
        { vin: '1HGBH41JXMN100015', make: "BMW", model: "7 Series", year: 2020, msrp: 135000, licensePlateState: "TX", yearRegistered: 2020, status: "archived" },
        { vin: '1HGBH41JXMN100016', make: "Mercedes", model: "GLE", year: 2019, msrp: 110000, licensePlateState: "NY", yearRegistered: 2019, status: "action_taken" },
        { vin: '1HGBH41JXMN100017', make: "Audi", model: "A6", year: 2021, msrp: 90000, licensePlateState: "FL", yearRegistered: 2021, status: "viewed" },
        { vin: '1HGBH41JXMN100018', make: "Porsche", model: "Macan", year: 2022, msrp: 125000, licensePlateState: "CA", yearRegistered: 2022, status: "new" },
        { vin: '1HGBH41JXMN100019', make: "Lexus", model: "ES", year: 2020, msrp: 72000, licensePlateState: "NJ", yearRegistered: 2020, status: "archived" },
        { vin: '1HGBH41JXMN100020', make: "Toyota", model: "Camry", year: 2019, msrp: 65000, licensePlateState: "IL", yearRegistered: 2019, status: "action_taken" },
        { vin: '1HGBH41JXMN100021', make: "Honda", model: "Civic", year: 2024, msrp: 63000, licensePlateState: "TX", yearRegistered: 2024, status: "new" },
        { vin: '1HGBH41JXMN100022', make: "Ford", model: "Mustang", year: 2023, msrp: 88000, licensePlateState: "NV", yearRegistered: 2023, status: "viewed" },
        { vin: '1HGBH41JXMN100023', make: "Chevrolet", model: "Silverado", year: 2022, msrp: 95000, licensePlateState: "GA", yearRegistered: 2022, status: "archived" },
        { vin: '1HGBH41JXMN100024', make: "Nissan", model: "Altima", year: 2021, msrp: 67000, licensePlateState: "CA", yearRegistered: 2021, status: "new" },
        { vin: '1HGBH41JXMN100025', make: "Hyundai", model: "Tucson", year: 2020, msrp: 62000, licensePlateState: "FL", yearRegistered: 2020, status: "viewed" },
        { vin: '1HGBH41JXMN100026', make: "Kia", model: "Sportage", year: 2024, msrp: 75000, licensePlateState: "NC", yearRegistered: 2024, status: "new" },
        { vin: '1HGBH41JXMN100027', make: "Tesla", model: "Model X", year: 2023, msrp: 145000, licensePlateState: "WA", yearRegistered: 2023, status: "action_taken" },
        { vin: '1HGBH41JXMN100028', make: "BMW", model: "3 Series", year: 2022, msrp: 85000, licensePlateState: "CO", yearRegistered: 2022, status: "archived" },
        { vin: '1HGBH41JXMN100029', make: "Mercedes", model: "C-Class", year: 2021, msrp: 78000, licensePlateState: "MI", yearRegistered: 2021, status: "viewed" },
        { vin: '1HGBH41JXMN100030', make: "Audi", model: "A4", year: 2020, msrp: 68000, licensePlateState: "NJ", yearRegistered: 2020, status: "new" },
        { vin: '1HGBH41JXMN100031', make: "Porsche", model: "Panamera", year: 2019, msrp: 140000, licensePlateState: "NY", yearRegistered: 2019, status: "action_taken" },
        { vin: '1HGBH41JXMN100032', make: "Lexus", model: "NX", year: 2022, msrp: 78000, licensePlateState: "OH", yearRegistered: 2022, status: "new" },
        { vin: '1HGBH41JXMN100033', make: "Toyota", model: "RAV4", year: 2021, msrp: 65000, licensePlateState: "TX", yearRegistered: 2021, status: "viewed" },
        { vin: '1HGBH41JXMN100034', make: "Honda", model: "Accord", year: 2020, msrp: 62000, licensePlateState: "CA", yearRegistered: 2020, status: "archived" },
        { vin: '1HGBH41JXMN100035', make: "Ford", model: "Explorer", year: 2019, msrp: 72000, licensePlateState: "WA", yearRegistered: 2019, status: "new" },
        { vin: '1HGBH41JXMN100036', make: "Chevrolet", model: "Equinox", year: 2024, msrp: 65000, licensePlateState: "IL", yearRegistered: 2024, status: "viewed" },
        { vin: '1HGBH41JXMN100037', make: "Nissan", model: "Maxima", year: 2023, msrp: 67000, licensePlateState: "NV", yearRegistered: 2023, status: "new" },
        { vin: '1HGBH41JXMN100038', make: "Hyundai", model: "Sonata", year: 2022, msrp: 62000, licensePlateState: "NJ", yearRegistered: 2022, status: "archived" },
        { vin: '1HGBH41JXMN100039', make: "Kia", model: "Optima", year: 2021, msrp: 60000, licensePlateState: "GA", yearRegistered: 2021, status: "action_taken" },
        { vin: '1HGBH41JXMN100040', make: "Tesla", model: "Model 3", year: 2024, msrp: 88000, licensePlateState: "CA", yearRegistered: 2024, status: "new" },
        { vin: '1HGBH41JXMN100041', make: "BMW", model: "5 Series", year: 2023, msrp: 102000, licensePlateState: "FL", yearRegistered: 2023, status: "viewed" },
        { vin: '1HGBH41JXMN100042', make: "Mercedes", model: "E-Class", year: 2022, msrp: 90000, licensePlateState: "TX", yearRegistered: 2022, status: "archived" },
        { vin: '1HGBH41JXMN100043', make: "Audi", model: "Q5", year: 2021, msrp: 82000, licensePlateState: "NY", yearRegistered: 2021, status: "new" },
        { vin: '1HGBH41JXMN100044', make: "Porsche", model: "Cayenne", year: 2020, msrp: 115000, licensePlateState: "CA", yearRegistered: 2020, status: "viewed" },
        { vin: '1HGBH41JXMN100045', make: "Lexus", model: "LS", year: 2019, msrp: 95000, licensePlateState: "WA", yearRegistered: 2019, status: "archived" },
        { vin: '1HGBH41JXMN100046', make: "Toyota", model: "Corolla", year: 2024, msrp: 60000, licensePlateState: "OH", yearRegistered: 2024, status: "new" },
        { vin: '1HGBH41JXMN100047', make: "Honda", model: "CR-V", year: 2023, msrp: 68000, licensePlateState: "CO", yearRegistered: 2023, status: "viewed" },
        { vin: '1HGBH41JXMN100048', make: "Ford", model: "Fusion", year: 2022, msrp: 62000, licensePlateState: "NJ", yearRegistered: 2022, status: "archived" },
        { vin: '1HGBH41JXMN100049', make: "Chevrolet", model: "Cruze", year: 2021, msrp: 60000, licensePlateState: "MI", yearRegistered: 2021, status: "action_taken" },
        { vin: '1HGBH41JXMN100050', make: "Nissan", model: "Pathfinder", year: 2024, msrp: 90000, licensePlateState: "TX", yearRegistered: 2024, status: "new" },
        { vin: '1HGBH41JXMN100051', make: "Hyundai", model: "Ioniq 5", year: 2023, msrp: 95000, licensePlateState: "FL", yearRegistered: 2023, status: "viewed" },
        { vin: '1HGBH41JXMN100052', make: "Kia", model: "EV6", year: 2022, msrp: 89000, licensePlateState: "CA", yearRegistered: 2022, status: "new" },
        { vin: '1HGBH41JXMN100053', make: "Tesla", model: "Model X", year: 2021, msrp: 145000, licensePlateState: "WA", yearRegistered: 2021, status: "archived" },
        { vin: '1HGBH41JXMN100054', make: "BMW", model: "X7", year: 2020, msrp: 135000, licensePlateState: "NJ", yearRegistered: 2020, status: "viewed" },
        { vin: '1HGBH41JXMN100055', make: "Mercedes", model: "GLS", year: 2019, msrp: 140000, licensePlateState: "GA", yearRegistered: 2019, status: "action_taken" },
        { vin: '1HGBH41JXMN100056', make: "Audi", model: "Q8", year: 2024, msrp: 125000, licensePlateState: "IL", yearRegistered: 2024, status: "new" },
        { vin: '1HGBH41JXMN100057', make: "Porsche", model: "911", year: 2023, msrp: 150000, licensePlateState: "NV", yearRegistered: 2023, status: "viewed" },
        { vin: '1HGBH41JXMN100058', make: "Lexus", model: "GX", year: 2022, msrp: 96000, licensePlateState: "TX", yearRegistered: 2022, status: "new" },
        { vin: '1HGBH41JXMN100059', make: "Toyota", model: "Highlander", year: 2021, msrp: 70000, licensePlateState: "FL", yearRegistered: 2021, status: "archived" },
        { vin: '1HGBH41JXMN100060', make: "Honda", model: "Odyssey", year: 2020, msrp: 65000, licensePlateState: "CA", yearRegistered: 2020, status: "action_taken" },
        { vin: '1HGBH41JXMN100061', make: "Ford", model: "Expedition", year: 2019, msrp: 90000, licensePlateState: "WA", yearRegistered: 2019, status: "new" },
        { vin: '1HGBH41JXMN100062', make: "Chevrolet", model: "Suburban", year: 2024, msrp: 105000, licensePlateState: "OH", yearRegistered: 2024, status: "viewed" },
        { vin: '1HGBH41JXMN100063', make: "Nissan", model: "Murano", year: 2023, msrp: 75000, licensePlateState: "CO", yearRegistered: 2023, status: "new" },
        { vin: '1HGBH41JXMN100064', make: "Hyundai", model: "Palisa", year: 2022, msrp: 65000, licensePlateState: "NJ", yearRegistered: 2022, status: "archived" },
        { vin: '1HGBH41JXMN100065', make: "Kia", model: "Sorento", year: 2021, msrp: 70000, licensePlateState: "MI", yearRegistered: 2021, status: "viewed" },
        { vin: '1HGBH41JXMN100066', make: "Tesla", model: "Model 3", year: 2024, msrp: 88000, licensePlateState: "TX", yearRegistered: 2024, status: "new" },
        { vin: '1HGBH41JXMN100067', make: "BMW", model: "X6", year: 2023, msrp: 115000, licensePlateState: "FL", yearRegistered: 2023, status: "archived" },
        { vin: '1HGBH41JXMN100068', make: "Mercedes", model: "EQS", year: 2022, msrp: 150000, licensePlateState: "CA", yearRegistered: 2022, status: "action_taken" },
        { vin: '1HGBH41JXMN100069', make: "Audi", model: "RS7", year: 2021, msrp: 140000, licensePlateState: "WA", yearRegistered: 2021, status: "viewed" },
        { vin: '1HGBH41JXMN100070', make: "Porsche", model: "Taycan", year: 2020, msrp: 145000, licensePlateState: "NJ", yearRegistered: 2020, status: "new" },
        { vin: '1HGBH41JXMN100071', make: "Lexus", model: "LC", year: 2019, msrp: 125000, licensePlateState: "GA", yearRegistered: 2019, status: "archived" },
        { vin: '1HGBH41JXMN100072', make: "Toyota", model: "Supra", year: 2024, msrp: 90000, licensePlateState: "IL", yearRegistered: 2024, status: "new" },
        { vin: '1HGBH41JXMN100073', make: "Honda", model: "Insight", year: 2025, msrp: 62000, licensePlateState: "NV", yearRegistered: 2009, status: "viewed" }
      ];

      of(dummyLists)
        .pipe(delay(3000)) // simulate network latency
        .subscribe({
          next: lists => this.carListSubject.next(lists),
          error: err => this.errorSubject.next('Failed to load dummy list'),
          complete: () => this.loadingSubject.next(false),
        });

    } else {
      // real backend
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      });

      this.http.get<CarReport[]>(this.baseProxyUrl, { headers })
        .pipe(
          catchError(err => {
            this.errorSubject.next(err.message || 'Something went wrong');
            return throwError(() => err);
          }),
          finalize(() => this.loadingSubject.next(false)) // ✅ stop loading
        )
        .subscribe(lists => this.carListSubject.next(lists));
    }
  }

  // 🔹 When hooking up to a real backend:

  // this.loadingSubject.next(true);
  // this.errorSubject.next(null);

  // this.http.get<SavedList[]>(this.baseUrl)
  //   .pipe(
  //     catchError((err: HttpErrorResponse) => {
  //       this.errorSubject.next(err.message || 'Something went wrong');
  //       return throwError(() => err);
  //     }),
  //     finalize(() => this.loadingSubject.next(false))
  //   )
  //   .subscribe(lists => this.listsSubject.next(lists));


  public getCarReportById(vin: string): Observable<CarRecord> {
    const url = `${this.baseProxyUrl}?vin=${vin}`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`,        // sending key as header
      'Content-Type': 'application/json'
    });

    const proxyHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.get<CarRecord>(url, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  public getVinToPlate(vin: string): Observable<CarRecord> {
    const url = `${this.baseVinToPlateUrl}?vin=${vin}`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`,        // sending key as header
      'Content-Type': 'application/json'
    });

    const proxyHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.get<CarRecord>(url, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  public getCarReportsFromSavedList() {

  }

  public editCarReportStatus() {

  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      // Client-side / network error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code
      errorMessage = `Server Error ${error.status}: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

}