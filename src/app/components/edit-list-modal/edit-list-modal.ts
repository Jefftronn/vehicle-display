import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ListService } from '../../services/list.service';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogClose,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SavedList } from '../../models/saved-list.model';

@Component({
  selector: 'app-edit-list-modal',
  imports: [ReactiveFormsModule, CommonModule, MatInputModule, MatDialogClose, MatButtonModule,],
  templateUrl: './edit-list-modal.html',
  styleUrl: './edit-list-modal.css'
})
export class EditListModal {
  public editListForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private listService: ListService,
    private dialogRef: MatDialogRef<EditListModal>,
    @Inject(MAT_DIALOG_DATA) public data: SavedList
  ) {

    this.editListForm = this.fb.group({
      name: [data.name, Validators.required],
      description: [data.description, Validators.required],
    })
  }

  public onCancel() {
    this.dialogRef.close(); // close without creating
  }

  public onSubmit() {
    if (this.editListForm.invalid) return;

    const { name, description } = this.editListForm.value;
    this.handleEditList({ name, description })
  }

  private handleEditList(data: any): void {
    const updateData = { ...data, id: this.data.id }; // include the id
    this.listService.updateList(updateData).subscribe({
      next: (list) => {
        this.dialogRef.close(list); // ✅ closes dialog
      },
      error: (err) => console.error(err)
    });
  }
}
