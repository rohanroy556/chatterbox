import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CommonService } from 'src/app/service';
import { User } from '../../auth.model';

/**
 * Component to login and signup users.
 */
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  /**
   * Define form groups and set validators for the fields
   */
  loginFormGroup: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(5)]]
  });
  signupFormGroup: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(5)]],
    confirmPassword: ['', [Validators.required]],
    name: ['', [Validators.required]]
  });
  passwordMatchValidator = (formGroup: FormGroup) => {
    return () => formGroup.get('password')?.value === formGroup.get('confirmPassword')?.value
      ? null : { passwordMismatch: true };
  };

  get loginEmail() { return this.loginFormGroup.get('email'); }
  get loginPassword() { return this.loginFormGroup.get('password'); }

  get signupEmail() { return this.signupFormGroup.get('email'); }
  get signupPassword() { return this.signupFormGroup.get('password'); }
  get signupConfirmPassword() { return this.signupFormGroup.get('confirmPassword'); }
  get signupName() { return this.signupFormGroup.get('name'); }

  constructor(
    private commonService: CommonService,
    public dialogRef: MatDialogRef<AuthComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      login(email: string, password: string): Observable<User>,
      signup(email: string, password: string, name: string): Observable<User>
    },
    private formBuilder: FormBuilder
  ) { }
  
  /**
   * Set validator for checking if password and confirm password match during signup.
   */
  ngOnInit(): void {
    this.signupConfirmPassword?.setValidators([this.passwordMatchValidator(this.signupFormGroup)])
  }
  
  /**
   * Login using email and password. Only valid login form is allowed to run this function.
   */
  login() {
    if (!this.loginFormGroup.valid) return;
    this.data.login(this.loginEmail?.value, this.loginPassword?.value).subscribe(
      user => this.dialogRef.close(user),
      error => this.commonService.durationMessage(typeof error == 'string' ? error : 'Invalid email or password')
    );
  }

  /**
   * Signup using email, password and name. Only valid signup form is allowed to run this function.
   */
  signup() {
    if (!this.signupFormGroup.valid) return;
    this.data.signup(this.signupEmail?.value, this.signupPassword?.value, this.signupName?.value).subscribe(
      user => this.dialogRef.close(user),
      error => this.commonService.durationMessage(typeof error == 'string' ? error : 'Email already exists')
    );
  }
}
