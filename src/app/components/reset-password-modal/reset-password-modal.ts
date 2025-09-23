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
    { label: '1 Lower-Case', key: 'hasLowerCase' },
    { label: '1 Upper-Case', key: 'hasUpperCase' },
    { label: '1 Number', key: 'hasNumber' },
    { label: '1 Special Character (#?!@$%^&*-.,)', key: 'hasSpecialChar' },
    { label: 'More than 10 Characters', key: 'hasMinLength' },
  ];

  public ruleStatus: Record<string, boolean> = {
    hasLowerCase: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    hasMinLength: false,
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
      password: ['', [Validators.required, this.passwordValidator]],
    })
  }

  ngOnInit(): void {
    this.resetPasswordForm.get('password')?.valueChanges.subscribe((value) => {
      console.log(this.resetPasswordForm.value.username)
      const errors = this.resetPasswordForm.get('password')?.errors;

      if (!value) {
        this.ruleStatus = {
          hasLowerCase: false,
          hasUpperCase: false,
          hasNumber: false,
          hasSpecialChar: false,
          hasMinLength: false,
        };
        return;
      }

      this.ruleStatus = {
        hasLowerCase: !errors?.['lowerCase'],
        hasUpperCase: !errors?.['upperCase'],
        hasNumber: !errors?.['number'],
        hasSpecialChar: !errors?.['specialChar'],
        hasMinLength: !errors?.['minLength'],
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

  private passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const errors: ValidationErrors = {};
    if (!/[a-z]/.test(value)) errors['lowerCase'] = true;
    if (!/[A-Z]/.test(value)) errors['upperCase'] = true;
    if (!/\d/.test(value)) errors['number'] = true;
    if (!/[!@#$%^&*(),.?":{}|<>#?!@$%^&*\-.,]/.test(value)) errors['specialChar'] = true;
    if (value.length < 10) errors['minLength'] = true;

    return Object.keys(errors).length ? errors : null;
  }

  private handlePasswordReset(data: any): void {
    this.authService.resetPassword(data.username, data.password).subscribe({
      next: (list) => {
        this.dialogRef.close(list);
      },
      error: (err) => {
        console.error(err)
        this.errorMessage = err.message;
        this.openSnackBar(this.errorMessage ?? "Server Error. Please try again later.")
      }
    });
  }
}