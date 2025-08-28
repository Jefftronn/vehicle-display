import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
  MatDialogRef
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ListService } from '../../services/list.service';
import { SavedList } from '../../models/saved-list.model';

@Component({
  selector: 'app-delete-list-modal',
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, MatIcon, MatDialogTitle],
  templateUrl: './delete-list-modal.html',
  styleUrl: './delete-list-modal.css'
})
export class DeleteListModal {

  constructor(
    private listService: ListService,
    public dialogRef: MatDialogRef<DeleteListModal>,
    @Inject(MAT_DIALOG_DATA) public data: SavedList
  ) { }

  public onCancel() {
    this.dialogRef.close(); // close without creating
  }

  public onConfirm(data: any): void {
    this.listService.deleteList(data).subscribe({
      next: (list) => {
        this.dialogRef.close(list); // ✅ closes dialog
      },
      error: (err) => console.error(err)
    });
  }
}
