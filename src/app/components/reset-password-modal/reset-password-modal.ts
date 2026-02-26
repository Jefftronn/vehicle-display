import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AuthService, ResetPasswordData, ResetRequest } from '../../services/auth.service';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogClose,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reset-password-modal',
  imports: [ReactiveFormsModule, CommonModule, MatInputModule, MatDialogClose, MatButtonModule,],
  templateUrl: './reset-password-modal.html',
  styleUrl: './reset-password-modal.css'
})
export class ResetPasswordModal implements OnInit {
  public resetPasswordForm: FormGroup;
  public errorMessage?: string;
  public rules = [
    { label: 'At least 1 uppercase', key: 'hasUpperCase' },
    { label: 'At least 1 lowercase', key: 'hasLowerCase' },
    { label: 'At least 1 number', key: 'hasNumber' },
    { label: 'At least 1 special character (#?!@$%^&*-.,)', key: 'hasSpecialChar' },
    { label: 'At least 10 characters long', key: 'hasMinLength' },
    { label: 'Cannot contain username', key: 'containsUsername' },
  ];

  public ruleStatus: Record<string, boolean> = {
    hasLowerCase: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    hasMinLength: false,
    containsUsername: false,
  };

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ResetPasswordModal>,
    private authService: AuthService,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: ResetPasswordData
  ) {

    this.resetPasswordForm = this.fb.group({
      username: [data.fromLogin ? '' : data.username, Validators.required],
      password: ['', [Validators.required, this.passwordValidatorFactory(data)]],
    })
  }

  ngOnInit(): void {
    this.resetPasswordForm.get('password')?.valueChanges.subscribe((value) => {
      const errors = this.resetPasswordForm.get('password')?.errors;

      if (!value) {
        this.ruleStatus = {
          hasLowerCase: false,
          hasUpperCase: false,
          hasNumber: false,
          hasSpecialChar: false,
          hasMinLength: false,
          containsUsername: false,
        };
        return;
      }

      this.ruleStatus = {
        hasLowerCase: !errors?.['lowerCase'],
        hasUpperCase: !errors?.['upperCase'],
        hasNumber: !errors?.['number'],
        hasSpecialChar: !errors?.['specialChar'],
        hasMinLength: !errors?.['minLength'],
        containsUsername: !errors?.['containsUsername'],
      };
    });
  }

  public onCancel() {
    this.dialogRef.close();
  }

  public onSubmit() {
    if (this.resetPasswordForm.invalid) return;

    if (this.resetPasswordForm.valid) {
      const { username, password } = this.resetPasswordForm.value;
      this.handlePasswordReset({ username, password });
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

  private passwordValidatorFactory(data: ResetPasswordData): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const errors: ValidationErrors = {};
      if (!/[a-z]/.test(value)) errors['lowerCase'] = true;
      if (!/[A-Z]/.test(value)) errors['upperCase'] = true;
      if (!/\d/.test(value)) errors['number'] = true;
      if (!/[!@#$%^&*(),.?":{}|<>#?!@$%^&*\-.,]/.test(value)) errors['specialChar'] = true;
      if (value.length < 10) errors['minLength'] = true;

      let username = '';
      if (this.resetPasswordForm?.get('username')?.value) {
        username = this.resetPasswordForm.get('username')!.value;
      } else {
        username = data.username ?? '';
      }

      if (username && value.toLowerCase().includes(username.toLowerCase())) {
        errors['containsUsername'] = true;
      }

      return Object.keys(errors).length ? errors : null;
    };
  }

  private handlePasswordReset(data: any): void {
    this.authService.resetPassword(data.username, data.password).subscribe({
      next: (list) => {
        this.openSnackBar("Your password was reset successfully.")
        this.dialogRef.close(list);
      },
      error: (err) => {
        console.error(err)
        this.errorMessage = err.message;
        this.openSnackBar(this.errorMessage ?? "Reset Password Failed. Please try again later.")
      }
    });
  }
}