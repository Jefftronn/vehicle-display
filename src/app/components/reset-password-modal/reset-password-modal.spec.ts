import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { ResetPasswordModal } from './reset-password-modal';
import { AuthService } from '../../services/auth.service';

fdescribe('ResetPasswordModal', () => {
  let component: ResetPasswordModal;
  let fixture: ComponentFixture<ResetPasswordModal>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<ResetPasswordModal>>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  function logTestResult(testName: string, result: any = null, passed: boolean = true) {
    const status = passed ? 'PASS' : 'FAIL';
    console.log(`[${status}] ResetPasswordModal: ${testName}`, result !== null ? '→ ' + JSON.stringify(result) : '');
  }

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['resetPassword']);
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        ResetPasswordModal
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: MAT_DIALOG_DATA, useValue: { username: 'testUser', fromLogin: false, userRole: 'test', userID: 1 } },
        provideZonelessChangeDetection()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should prefill username when fromLogin is false', () => {
    const testName = 'should prefill username when fromLogin is false';
    try {
      expect(component.resetPasswordForm.value.username).toBe('testUser');
      logTestResult(testName);
    } catch (err) {
      logTestResult(testName, err, false);
      throw err;
    }
  });

  it('should require username when fromLogin is true', () => {
    const testName = 'should require username when fromLogin is true';
    try {
      const comp = new ResetPasswordModal(
        component['fb'],
        mockDialogRef,
        mockAuthService,
        mockSnackBar,
        { fromLogin: true, username: '', userRole: 'tester', userID: 123 }
      );
      expect(comp.resetPasswordForm.controls['username'].hasError('required')).toBeTrue();
      logTestResult(testName);
    } catch (err) {
      logTestResult(testName, err, false);
      throw err;
    }
  });

  it('should mark rules correctly for valid strong password', () => {
    const testName = 'should mark rules correctly for valid strong password';
    try {
      component.resetPasswordForm.setValue({ username: 'testUsercontain', password: 'ValidPass123!' });
      const passwordControl = component.resetPasswordForm.get('password');
      passwordControl?.updateValueAndValidity();
      expect(component.ruleStatus).toEqual({
        hasLowerCase: true,
        hasUpperCase: true,
        hasNumber: true,
        hasSpecialChar: true,
        hasMinLength: true,
        containsUsername: true,
      });
      logTestResult(testName, component.ruleStatus);
    } catch (err) {
      logTestResult(testName, err, false);
      throw err;
    }
  });

  it('should not call API when form invalid', () => {
    const testName = 'should not call API when form invalid';
    try {
      component.resetPasswordForm.controls['password'].setValue('');
      component.onSubmit();
      expect(mockAuthService.resetPassword).not.toHaveBeenCalled();
      logTestResult(testName);
    } catch (err) {
      logTestResult(testName, err, false);
      throw err;
    }
  });

  it('should call API and close dialog on valid form submit', () => {
    const testName = 'should call API and close dialog on valid form submit';
    try {
      component.resetPasswordForm.setValue({ username: 'user', password: 'StrongPass123!' });
      mockAuthService.resetPassword.and.returnValue(of({ success: true }));
      component.onSubmit();
      expect(mockAuthService.resetPassword).toHaveBeenCalled();
      expect(mockDialogRef.close).toHaveBeenCalledWith({ success: true });
      logTestResult(testName);
    } catch (err) {
      logTestResult(testName, err, false);
      throw err;
    }
  });

  it('should handle API error gracefully and show snack bar', () => {
    const testName = 'should handle API error gracefully and show snack bar';
    try {
      component.resetPasswordForm.setValue({ username: 'user', password: 'StrongPass123!' });
      mockAuthService.resetPassword.and.returnValue(throwError(() => new Error('Server error')));
      spyOn(console, 'error');
      component.onSubmit();
      expect(console.error).toHaveBeenCalledWith(jasmine.any(Error));
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        jasmine.any(String),
        'Close',
        jasmine.any(Object)
      );
      expect(mockDialogRef.close).not.toHaveBeenCalled();
      logTestResult(testName);
    } catch (err) {
      logTestResult(testName, err, false);
      throw err;
    }
  });

  it('should close dialog on cancel', () => {
    const testName = 'should close dialog on cancel';
    try {
      component.onCancel();
      expect(mockDialogRef.close).toHaveBeenCalled();
      logTestResult(testName);
    } catch (err) {
      logTestResult(testName, err, false);
      throw err;
    }
  });
});

fdescribe('ResetPasswordModal.passwordValidator', () => {
  function makeControl(value: string | null, username: string = ''): AbstractControl {
    return {
      value,
      root: {
        get: (name: string) => {
          if (name === 'username') return { value: username };
          return { value: '' };
        }
      }
    } as AbstractControl;
  }

  const username = 'testUser';
  const validatorFn = (ResetPasswordModal as any).prototype.passwordValidatorFactory({
    username,
    fromLogin: false
  });

  const tests = [
    { name: 'empty password', value: null, expected: null },
    { name: 'missing lowercase', value: 'ABC123!@#', expected: { lowerCase: true } },
    { name: 'missing uppercase', value: 'abc123!@#', expected: { upperCase: true } },
    { name: 'missing number', value: 'Abcdef!@#', expected: { number: true } },
    { name: 'missing specialChar', value: 'Abcdef123', expected: { specialChar: true } },
    { name: 'too short', value: 'Ab1!short', expected: { minLength: true } },
    { name: 'contains username (case-insensitive)', value: 'TestUser123!', expected: { containsUsername: true } },
    { name: 'strong password', value: 'ValidPass123!', expected: null }
  ];

  tests.forEach(t => {
    it(`should validate ${t.name}`, () => {
      const control = makeControl(t.value, t.name.includes('username') ? username : '');
      const result = validatorFn(control);
      if (t.expected === null) {
        expect(result).toBeNull();
      } else {
        expect(result as any).toEqual(jasmine.objectContaining(t.expected as any));
      }
    });
  });
});
