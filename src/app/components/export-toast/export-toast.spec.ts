import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportToast } from './export-toast';

describe('ExportToast', () => {
  let component: ExportToast;
  let fixture: ComponentFixture<ExportToast>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportToast]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportToast);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
