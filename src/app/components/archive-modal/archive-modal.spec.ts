import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveModal } from './archive-modal';

describe('ArchiveModal', () => {
  let component: ArchiveModal;
  let fixture: ComponentFixture<ArchiveModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchiveModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArchiveModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
