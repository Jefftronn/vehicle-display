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
  private baseUrl = 'https://api.bumper.com/sandbox/v1/vehicle/full'; // <-- your API endpoint
  private apiKey = '';
  private baseProxyUrl = '/api-bumper/sandbox/v1/vehicle/full';
  private baseNCVehicleProxyUrl = '/api/ncvehicle/summary';
  private baseVehicleDetailsProxyUrl = 'api/ncvehicle/detail';
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
      // const dummyLists: CarReport[] = [];
      const dummyLists: CarReport[] = [
        {
          "id": 5993,
          "vin": "ZFF74UFA5D0193635",
          "household": "BECKER | 565 E 16TH AVE",
          "make": "FERRARI",
          "model": "F12BERLINETTA",
          "year": "2013",
          "msrp": 315888,
          "batch": 1
        },
        {
          "id": 5574,
          "vin": "ZHWUG7ZFXRLA26334",
          "household": "BINNING | 6274 W GRANT CIR",
          "make": "LAMBORGHINI",
          "model": "HURACN",
          "year": "2024",
          "msrp": 293634,
          "batch": 1
        },
        {
          "id": 2294,
          "vin": "WP0AG2A94PS252101",
          "household": "BERMES | 5651 COVENTRY L",
          "make": "PORSCHE",
          "model": "911",
          "year": "2023",
          "msrp": 272300,
          "batch": 1
        },
        {
          "id": 2284,
          "vin": "ZHWUF4ZF1LLA13867",
          "household": "BOURGOIN | 2986 CASTLE DR",
          "make": "LAMBORGHINI",
          "model": "HURACAN",
          "year": "2020",
          "msrp": 261274,
          "batch": 1
        },
        {
          "id": 8076,
          "vin": "SCFRMHCV6PGT03272",
          "household": "BASTIAN | 2975 EXREC PKWY STE 196",
          "make": "ASTON MARTIN",
          "model": "DBS",
          "year": "2023",
          "msrp": 257128,
          "batch": 1
        },
        {
          "id": 4043,
          "vin": "ZHWUC1ZF5FLA01247",
          "household": "BONHAM | 2655 W 15090 S",
          "make": "LAMBORGHINI",
          "model": "HURACAN",
          "year": "2015",
          "msrp": 237250,
          "batch": 1
        },
        {
          "id": 1036,
          "vin": "ZPBUA1ZL8NLA19802",
          "household": "BOTT | 1651 E BOX ELDER CIR",
          "make": "LAMBORGHINI",
          "model": "URUS",
          "year": "2022",
          "msrp": 221506,
          "batch": 1
        },
        {
          "id": 4257,
          "vin": "WP0CD2A9XMS263732",
          "household": "BIRNKRANT | 275 LOWER EVERGREEN DR",
          "make": "PORSCHE",
          "model": "911",
          "year": "2021",
          "msrp": 216300,
          "batch": 1
        },
        {
          "id": 4940,
          "vin": "SBM13GAA6HW001424",
          "household": "ANDERSON | 3195 E BLUE QUARTZ DR",
          "make": "MCLAREN",
          "model": "570GT",
          "year": "2017",
          "msrp": 198950,
          "batch": 1
        },
        {
          "id": 4864,
          "vin": "ZFF65LJA6B0181162",
          "household": "ADAMS | 3220 MILLCREEK RD",
          "make": "FERRARI",
          "model": "CALIFORNIA",
          "year": "2011",
          "msrp": 192000,
          "batch": 1
        },
        {
          "id": 6765,
          "vin": "SCFSMGFW6SGN09815",
          "household": "BELL | 11303 N STONEY BROOK CT",
          "make": "ASTON MARTIN",
          "model": "VANTAGE",
          "year": "2025",
          "msrp": 191000,
          "batch": 1
        },
        {
          "id": 6006,
          "vin": "WUASUAFG6F7000725",
          "household": "BLEADON | 1703 W GRAFTON RD",
          "make": "AUDI",
          "model": "R8",
          "year": "2015",
          "msrp": 190600,
          "batch": 1
        },
        {
          "id": 3418,
          "vin": "WP0BB2A98PS233893",
          "household": "BIAGI | 2145 BEAR HOLLOW DR",
          "make": "PORSCHE",
          "model": "911",
          "year": "2023",
          "msrp": 186200,
          "batch": 1
        },
        {
          "id": 4011,
          "vin": "W1NYC7HJ6PX487554",
          "household": "BENZION | 2825 E CRAIG DR",
          "make": "MERCEDES-BENZ",
          "model": "G-CLASS",
          "year": "2023",
          "msrp": 179000,
          "batch": 1
        },
        {
          "id": 4616,
          "vin": "W1NYC7HJ0PX473584",
          "household": "ADAMS | 274 S 600 E",
          "make": "MERCEDES-BENZ",
          "model": "G-CLASS",
          "year": "2023",
          "msrp": 179000,
          "batch": 1
        },
        {
          "id": 5259,
          "vin": "WP0BB2A98RS233279",
          "household": "ALLAK | 7148 S CITY VIEW DRIVE",
          "make": "PORSCHE",
          "model": "911",
          "year": "2024",
          "msrp": 171000,
          "batch": 1
        },
        {
          "id": 4449,
          "vin": "WP0BB2A90NS232508",
          "household": "ANDRUS | 2411 E WALKER LN",
          "make": "PORSCHE",
          "model": "911",
          "year": "2022",
          "msrp": 156800,
          "batch": 1
        },
        {
          "id": 1139,
          "vin": "WP0BB2A90NS232315",
          "household": "BERMES | 5651 COVENTRY L",
          "make": "PORSCHE",
          "model": "911",
          "year": "2022",
          "msrp": 156800,
          "batch": 1
        },
        {
          "id": 1233,
          "vin": "W1NYC7HJ3MX418364",
          "household": "AUGASON | 13106 S RIVERBENDVIEW COVE",
          "make": "MERCEDES-BENZ",
          "model": "G-CLASS",
          "year": "2021",
          "msrp": 156450,
          "batch": 1
        },
        {
          "id": 2371,
          "vin": "WP0AF2A77JL141044",
          "household": "AMACHER | 702 S ALPINE HIGHWAY",
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