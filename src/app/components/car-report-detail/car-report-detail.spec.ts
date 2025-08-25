import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarReportDetail } from './car-report-detail';

describe('CarReportDetail', () => {
  let component: CarReportDetail;
  let fixture: ComponentFixture<CarReportDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarReportDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarReportDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
