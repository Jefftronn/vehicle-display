import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListService } from '../../services/list.service';
import { Observable, map, catchError, of } from 'rxjs';
import { SavedList } from '../../models/saved-list.model';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateListModal } from '../create-list-modal/create-list-modal';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { DeleteListModal } from '../delete-list-modal/delete-list-modal';
import { EditListModal } from '../edit-list-modal/edit-list-modal';
@Component({
  selector: 'app-side-bar',
  imports: [CommonModule, ReactiveFormsModule, MatMenuModule, MatIcon],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css'
})
export class SideBar implements OnInit {
  public isDropdownOpen: boolean = true;
  public lists$!: Observable<SavedList[]>;
  public loading$!: Observable<boolean>;
  public error$!: Observable<string | null>;
  private fb = inject(FormBuilder);

  public createListForm = this.fb.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
  })

  constructor(private router: Router, private listService: ListService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.lists$ = this.listService.lists$;
    this.loading$ = this.listService.loading$;
    this.error$ = this.listService.error$;

    this.listService.loadUserLists();
  }

  public viewDashboard() {
    this.router.navigate(['/dashboard'])
  }

  public viewHouseHolds() {
    this.router.navigate(['/household'])
  }

  public onDropDownClick() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  public openCreateListModal() {
    const dialogRef = this.dialog.open(CreateListModal, {
      width: '400px',
      panelClass: 'custom-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

  public openEditListModal(list: any) {
    const dialogRef = this.dialog.open(EditListModal, {
      width: '400px',
      panelClass: 'custom-dialog',
      data: list,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

  public openDeleteListModal(list: any) {
    const dialogRef = this.dialog.open(DeleteListModal, {
      autoFocus: false,
      width: '400px',
      panelClass: 'custom-dialog',
      data: list,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }
}
