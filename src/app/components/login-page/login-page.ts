import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    ReactiveFormsModule, MatSnackBarModule
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPage implements OnInit {
  public errorMessage?: string;
  public loading?: boolean = false;
  public backgroundImage = '/assets/images/pexels-pixabay-164634.jpg';
  private fb = inject(FormBuilder);
  public loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  })

  constructor(private authService: AuthService, private router: Router, private snackbar: MatSnackBar) { }

  public ngOnInit(): void {
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
      horizontalPosition: 'center',   // 'start' | 'center' | 'end' | 'left' | 'right'
      verticalPosition: 'bottom',        // 'top' | 'bottom'
      panelClass: ['error-snackbar']
    });
  }

  private handleLogin(data: any): void {
    this.loading = true;
    this.authService.login(data.username, data.password).subscribe({
      next: (data) => {
        this.loading = false;
        this.errorMessage = undefined;
        this.router.navigate(['/dashboard'])
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.message;
        this.loginForm.reset();
        console.log(this.errorMessage, err);
        // this.carData = undefined;
        this.openSnackBar(this.errorMessage ?? "Server Error. Please try again later.")
      }
    })
  }
}
