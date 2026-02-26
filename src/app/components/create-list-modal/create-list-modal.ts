import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ListService } from '../../services/list.service';
import {
  MatDialogRef,
  MatDialogClose,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-create-list-modal',
  imports: [ReactiveFormsModule, CommonModule, MatInputModule, MatDialogClose, MatButtonModule,],
  templateUrl: './create-list-modal.html',
  styleUrl: './create-list-modal.css'
})
export class CreateListModal {
  public createListForm: FormGroup;
  constructor(private fb: FormBuilder, private listService: ListService, private dialogRef: MatDialogRef<CreateListModal>) {

    this.createListForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    })
  }

  public onCancel() {
    this.dialogRef.close();
  }

  public onSubmit() {
    if (this.createListForm.invalid) return;

    const { name, description } = this.createListForm.value;
    this.handleCreateList({ name, description })
  }

  private handleCreateList(data: any): void {
    this.listService.createList(data).subscribe({
      next: (list) => {
        this.dialogRef.close(list);
      },
      error: (err) => console.error(err)
    });
  }
}
