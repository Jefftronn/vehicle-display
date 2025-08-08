import { Component, OnInit } from '@angular/core';
import { CarReportService } from '../../services/car-report.service';
import { CarRecord, Automobile } from '../../models/car-record.model';

@Component({
  selector: 'app-login-page',
  imports: [],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPage implements OnInit{
  public errorMessage?: string;
  public carData?: Automobile[];
  public backgroundImage = '/assets/images/pexels-pixabay-164634.jpg';

  constructor(private carReportService: CarReportService) {}

  public ngOnInit(): void {
    this.fetchCarReports('ZPBUC3ZL2RLA31892');
  }

  public fetchCarReports(vin: string) {
    this.carReportService.getCarReports(vin).subscribe({
      next: (data) => {
        this.carData = data.entities.vehicles.automobiles;
        this.errorMessage = undefined;
        console.log(this.carData);
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.carData = undefined;
      }
    });
  }
}
