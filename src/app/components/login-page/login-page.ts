import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [
    ReactiveFormsModule  // Needed for formGroup, formControlName
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

  constructor(private authService: AuthService, private router: Router) { }

  public ngOnInit(): void {
  }

  public onSubmit() {
    if (this.loginForm.valid && !this.loading) {
      const { username, password } = this.loginForm.value;
      this.handleLogin({ username, password });
    }
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
        console.log(this.errorMessage);
        // this.carData = undefined;
      }
    })
  }
}
