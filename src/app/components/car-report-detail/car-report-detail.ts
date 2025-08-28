import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarReportService } from '../../services/car-report.service';

@Component({
  selector: 'app-car-report-detail',
  imports: [],
  templateUrl: './car-report-detail.html',
  styleUrl: './car-report-detail.css'
})
export class CarReportDetail implements OnInit {
  public carVin?: string;

  constructor(private route: ActivatedRoute, private carReportService: CarReportService) { }

  ngOnInit(): void {
    const vin = this.route.snapshot.paramMap.get('vin'); // gets VIN from URL
    if (vin) {
      this.carVin = vin;
    }
  }

}
