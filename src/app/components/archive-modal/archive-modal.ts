import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-archive-modal',
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, MatIcon, MatDialogTitle],
  templateUrl: './archive-modal.html',
  styleUrl: './archive-modal.css'
})
export class ArchiveModal {

}
