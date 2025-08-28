import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteListModal } from './delete-list-modal';

describe('DeleteListModal', () => {
  let component: DeleteListModal;
  let fixture: ComponentFixture<DeleteListModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteListModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteListModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
