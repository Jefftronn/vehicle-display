import { Component, OnInit, viewChild } from '@angular/core';
import { AuthService, UserProfile, ResetPasswordData } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ResetPasswordModal } from '../reset-password-modal/reset-password-modal';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-nav-bar',
  imports: [MatMenuModule],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css'
})
export class NavBar {
  public userProfile: UserProfile | null = null;
  readonly menuTrigger = viewChild.required(MatMenuTrigger);

  constructor(private authService: AuthService, private router: Router, private dialog: MatDialog,
  ) { }

  public ngOnInit(): void {
    this.authService.getProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
      }
    })
  }

  public viewDashboard() {
    this.router.navigate(['/dashboard'])
  }

  public openResetPasswordModal() {
    const dialogRef = this.dialog.open(ResetPasswordModal, {
      width: '400px',
      panelClass: 'custom-dialog',
      data: {
        ...this.userProfile,
        fromLogin: false
      } as ResetPasswordData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

  public logout(): void {
    this.authService.logout();
  }
}
