import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditListModal } from './edit-list-modal';

describe('EditListModal', () => {
  let component: EditListModal;
  let fixture: ComponentFixture<EditListModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditListModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditListModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
