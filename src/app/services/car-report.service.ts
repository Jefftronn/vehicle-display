import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable, throwError, of } from "rxjs";
import { catchError, finalize, delay, map, tap } from "rxjs/operators";
import { CarRecord, VehicleDetail } from "../models/car-record.model";
import { CarReport } from "../models/car-report.model";

@Injectable({
  providedIn: 'root',
})

export class CarReportService {
  private carListSubject = new BehaviorSubject<CarReport[]>([]);
  public carList$ = this.carListSubject.asObservable();
  private vehicleSummarySubject = new BehaviorSubject<VehicleDetail | null>(null);
  public vehicleSummary$ = this.vehicleSummarySubject.asObservable();
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();
  private baseUrl = '';
  private apiKey = '';
  private baseProxyUrl = '/api-bumper/sandbox/v1/vehicle/full';
  private baseNCVehicleProxyUrl = '/api/ncvehicle/summary';
  private baseVehicleDetailsProxyUrl = 'api/ncvehicle/detail';
  private baseVinToPlateUrl = '/api-bumper/sandbox/v1/vehicle/vin_to_plate'

  constructor(private http: HttpClient) { }

  public getCarReports(vin: string): Observable<CarRecord> {
    const url = `${this.baseProxyUrl}?vin=${vin}`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`,
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
      // const dummyLists: CarReport[] = [];
      const dummyLists: CarReport[] = [
        {
          "id": 5993,
          "vin": "JTHBP5C2XA5034892",
          "household": "JOHNSON | 1234 MAPLE ST",
          "make": "FERRARI",
          "model": "F12BERLINETTA",
          "year": "2013",
          "msrp": 315888,
          "batch": 1
        },
        {
          "id": 5574,
          "vin": "WVWZZZ3CZ9E123456",
          "household": "MARTINEZ | 5678 OAK AVE",
          "make": "LAMBORGHINI",
          "model": "HURACN",
          "year": "2024",
          "msrp": 293634,
          "batch": 1
        },
        {
          "id": 2294,
          "vin": "1G1YY22G965112345",
          "household": "SMITH | 9012 PINE RD",
          "make": "PORSCHE",
          "model": "911",
          "year": "2023",
          "msrp": 272300,
          "batch": 1
        },
        {
          "id": 2284,
          "vin": "2HGCV51667H512345",
          "household": "WILLIAMS | 3456 ELM DR",
          "make": "LAMBORGHINI",
          "model": "HURACAN",
          "year": "2020",
          "msrp": 261274,
          "batch": 1
        },
        {
          "id": 8076,
          "vin": "3G5DL03G072512345",
          "household": "BROWN | 7890 BIRCH LN",
          "make": "ASTON MARTIN",
          "model": "DBS",
          "year": "2023",
          "msrp": 257128,
          "batch": 1
        },
        {
          "id": 4043,
          "vin": "4T1BF1AK5CU512345",
          "household": "DAVIS | 2345 CEDAR CT",
          "make": "LAMBORGHINI",
          "model": "HURACAN",
          "year": "2015",
          "msrp": 237250,
          "batch": 1
        },
        {
          "id": 1036,
          "vin": "5TDJKRFH8LS512345",
          "household": "MILLER | 6789 SPRUCE WAY",
          "make": "LAMBORGHINI",
          "model": "URUS",
          "year": "2022",
          "msrp": 221506,
          "batch": 1
        },
        {
          "id": 4257,
          "vin": "6G1YT52G762512345",
          "household": "WILSON | 4567 WILLOW PL",
          "make": "PORSCHE",
          "model": "911",
          "year": "2021",
          "msrp": 216300,
          "batch": 1
        },
        {
          "id": 4940,
          "vin": "7A3DB3FB8ES512345",
          "household": "ANDERSON | 8901 HICKORY ST",
          "make": "MCLAREN",
          "model": "570GT",
          "year": "2017",
          "msrp": 198950,
          "batch": 1
        },
        {
          "id": 4864,
          "vin": "8AG3D55W74F512345",
          "household": "TAYLOR | 1230 ASPEN RD",
          "make": "FERRARI",
          "model": "CALIFORNIA",
          "year": "2011",
          "msrp": 192000,
          "batch": 1
        },
        {
          "id": 6765,
          "vin": "9BH4E66X85G512345",
          "household": "THOMAS | 5671 COTTONWOOD AVE",
          "make": "ASTON MARTIN",
          "model": "VANTAGE",
          "year": "2025",
          "msrp": 191000,
          "batch": 1
        },
        {
          "id": 6006,
          "vin": "WBADO6732JG512345",
          "household": "JACKSON | 9012 SYCAMORE DR",
          "make": "AUDI",
          "model": "R8",
          "year": "2015",
          "msrp": 190600,
          "batch": 1
        },
        {
          "id": 3418,
          "vin": "WBASE7AJ1JH512345",
          "household": "WHITE | 3456 FRINGE BLVD",
          "make": "PORSCHE",
          "model": "911",
          "year": "2023",
          "msrp": 186200,
          "batch": 1
        },
        {
          "id": 4011,
          "vin": "WDCGG5GB6LF512345",
          "household": "HARRIS | 7890 ROCKY TOP",
          "make": "MERCEDES-BENZ",
          "model": "G-CLASS",
          "year": "2023",
          "msrp": 179000,
          "batch": 1
        },
        {
          "id": 4616,
          "vin": "YDCZZ6ZZ7MG512345",
          "household": "MARTIN | 2345 SHADOW LN",
          "make": "MERCEDES-BENZ",
          "model": "G-CLASS",
          "year": "2023",
          "msrp": 179000,
          "batch": 1
        },
        {
          "id": 5259,
          "vin": "ZHENG5JJHKN512345",
          "household": "GARCIA | 6789 SUNSET PEAK",
          "make": "PORSCHE",
          "model": "911",
          "year": "2024",
          "msrp": 171000,
          "batch": 1
        },
        {
          "id": 4449,
          "vin": "1HGBH41JXMN512345",
          "household": "RODRIGUEZ | 4567 CRYSTAL LAKE",
          "make": "PORSCHE",
          "model": "911",
          "year": "2022",
          "msrp": 156800,
          "batch": 1
        },
        {
          "id": 1139,
          "vin": "2HGEJ6204XM512345",
          "household": "PATEL | 8901 MOUNTAIN VIEW",
          "make": "PORSCHE",
          "model": "911",
          "year": "2022",
          "msrp": 156800,
          "batch": 1
        },
        {
          "id": 1233,
          "vin": "3HGCM65637M512345",
          "household": "CHEN | 1230 RIVERSIDE TER",
          "make": "MERCEDES-BENZ",
          "model": "G-CLASS",
          "year": "2021",
          "msrp": 156450,
          "batch": 1
        },
        {
          "id": 2371,
          "vin": "4HGCP5F80RM512345",
          "household": "KUMAR | 5671 FOREST GLEN",
          "make": "PORSCHE",
          "model": "PANAMERA",
          "year": "2018",
          "msrp": 150000,
          "batch": 1
        }
      ]

      of(dummyLists)
        .pipe(delay(3000))
        .subscribe({
          next: lists => this.carListSubject.next(lists),
          error: err => this.errorSubject.next('Failed to load dummy list'),
          complete: () => this.loadingSubject.next(false),
        });

    } else {
      // real backend

      this.loadingSubject.next(true);
      this.errorSubject.next(null);
      // const headers = new HttpHeaders({
      //   'Authorization': `Bearer ${this.apiKey}`,
      //   'Content-Type': 'application/json'
      // });

      this.http.get<CarReport[]>(this.baseNCVehicleProxyUrl)
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

  public getCarById(id: string): Observable<VehicleDetail> {
    const url = `${this.baseVehicleDetailsProxyUrl}?id=${id}`;

    return this.http.get<VehicleDetail>(url).pipe(
      map((car: VehicleDetail) => {
        // Defensive check in case holderInformation is missing or not an array
        if (Array.isArray(car?.holderInformation)) {
          car.holderInformation = [...car.holderInformation].sort((a, b) =>
            (a.fullName || '').localeCompare(b.fullName || '', undefined, { sensitivity: 'base' })
          );
        }

        if (Array.isArray(car?.titleInformation)) {
          car.titleInformation = [...car.titleInformation].sort((a, b) => {
            const dateA = new Date(a.titleDate).getTime();
            const dateB = new Date(b.titleDate).getTime();
            return dateB - dateA; // most recent first
          });
        }
        return car;
      }),
      catchError(err => {
        console.error('Error fetching car:', err);
        return throwError(() => err);
      })
    );
  }

  public getCarReportByVin(vin: string): Observable<VehicleDetail | null> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
    this.vehicleSummarySubject.next(null);

    return this.http.get<VehicleDetail[]>('/dummy/vehicle-details.json').pipe(
      map(cars => {
        const car = cars.find(c => c.vehicleInformation.vin === vin) || null;

        if (car) {
          // Sort holderInformation alphabetically
          if (Array.isArray(car.holderInformation)) {
            car.holderInformation = [...car.holderInformation].sort((a, b) =>
              (a.fullName || '').localeCompare(b.fullName || '', undefined, { sensitivity: 'base' })
            );
          }

          // Sort titleInformation by titleDate (most recent first)
          if (Array.isArray(car.titleInformation)) {
            car.titleInformation = [...car.titleInformation].sort((a, b) => {
              const dateA = new Date(a.titleDate).getTime();
              const dateB = new Date(b.titleDate).getTime();
              return dateB - dateA;
            });
          }
        }

        return car;
      }),
      tap(car => {
        if (!car) {
          this.errorSubject.next('Car not found in dummy JSON');
        }
      }),
      catchError(err => {
        this.errorSubject.next(err.message || 'Error loading dummy data');
        return throwError(() => err);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  public getVehicleSummary(): Observable<VehicleDetail | null> {
    return this.vehicleSummary$;
  }

  public getVinToPlate(vin: string): Observable<CarRecord> {
    const url = `${this.baseVinToPlateUrl}?vin=${'1G1YY22G965112345'}`;

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