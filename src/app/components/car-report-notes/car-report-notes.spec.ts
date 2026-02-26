import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarReportNotes } from './car-report-notes';

describe('CarReportNotes', () => {
  let component: CarReportNotes;
  let fixture: ComponentFixture<CarReportNotes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarReportNotes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarReportNotes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
