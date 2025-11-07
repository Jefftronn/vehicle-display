import { Component, OnInit, inject, signal, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from "@angular/router";
import { AuthService, ResetPasswordData } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ResetPasswordModal } from '../reset-password-modal/reset-password-modal';
import { CommonModule } from '@angular/common';
import { animate, style } from '@angular/animations';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    ReactiveFormsModule, MatSnackBarModule, CommonModule
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPage implements OnInit {
  showOverlay = false;
  public errorMessage?: string;
  public loading: boolean = false;
  public backgroundImage = '/assets/images/pexels-pixabay-164634.jpg';
  private fb = inject(FormBuilder);
  public loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  })

  circleGrow = animate('700ms ease-out', style({
    width: '3000px',
    height: '3000px',
    borderRadius: '50%',
    backgroundColor: '#3B82F6',
    opacity: 1
  }));

  circleShrink = animate('500ms ease-in', style({
    width: '0px',
    height: '0px',
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    opacity: 0
  }));

  constructor(private authService: AuthService, private router: Router, private snackbar: MatSnackBar, private dialog: MatDialog, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  public onSubmit() {
    if (this.loginForm.valid && !this.loading) {
      const { username, password } = this.loginForm.value;
      this.handleLogin({ username, password });
    }
  }

  public openSnackBar(message: string, action: string = 'Close') {
    this.snackbar.open(message, 'Close', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar']
    });
  }

  public openResetPasswordModal(openedFromLogin: boolean) {
    const dialogRef = this.dialog.open(ResetPasswordModal, {
      width: '400px',
      panelClass: 'custom-dialog',
      data: {
        fromLogin: openedFromLogin
      } as ResetPasswordData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

  enterClass = signal('enter-animation');

  private handleLogin(data: any): void {
    this.loading = true;
    this.authService.login(data.username, data.password).subscribe({
      next: (data) => {
        this.showOverlay = true;
        this.cd.detectChanges();
        setTimeout(() => {
          this.loading = false;
          this.errorMessage = undefined;
          this.showOverlay = false;
          this.router.navigate(['/dashboard'])
        }, 600);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.message;
        this.loginForm.reset();
        // this.carData = undefined;
        this.openSnackBar(this.errorMessage ?? "Login failed. Please try again later.")
      }
    })
  }
}
