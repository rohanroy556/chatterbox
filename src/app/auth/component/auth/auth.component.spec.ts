import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { CommonService } from 'src/app/service';
import { User } from '../../auth.model';

import { AuthComponent } from './auth.component';

const commonService = {
  showAppLoader: false,
  durationMessage: () => {}
}
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJhbmRvbUBleGFtcGxlLmNvbSIsIm5hbWUiOiJKb2huIERvZSJ9.h1rztIET9qhX61oMbq7Fd6pnvnKn7NnDrBNZftiIY28';
const mockUser: User = { _id: 'id', email: 'random@example.com', token, name: 'John Doe' };

const mockData = {
  login: () => of(mockUser),
  signup: () => of(mockUser)
}

const mockMatDialogRef = {
  close: () => {}
};

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let service: CommonService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthComponent ],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        MaterialModule,
        ReactiveFormsModule
      ],
      providers:[
        { provide: CommonService, useValue: commonService },
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockData }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    service = TestBed.inject(CommonService);
    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should login', () => {
    component.loginFormGroup.setValue({ email: mockUser.email, password: 'password' });
    fixture.detectChanges();
    const spy = spyOn(component.dialogRef, 'close');
    component.login();
    expect(spy).toHaveBeenCalledWith(mockUser);

    mockData.login = () => throwError({})
    fixture.detectChanges();
    let spy2 = spyOn(service, 'durationMessage');
    component.login();
    expect(spy2).toHaveBeenCalledWith('Invalid email or password');

    mockData.login = () => throwError('error')
    fixture.detectChanges();
    component.login();
    expect(spy2).toHaveBeenCalledWith('error');

    component.loginFormGroup.controls['email'].setValue('random');
    fixture.detectChanges();
    component.login();
    expect(component.loginEmail?.hasError('email')).toBeTruthy();
  });

  it('should signup', () => {
    component.signupFormGroup.setValue({ email: mockUser.email, password: 'password', confirmPassword: 'password', name: mockUser.name });
    fixture.detectChanges();
    const spy = spyOn(component.dialogRef, 'close');
    component.signup();
    expect(spy).toHaveBeenCalledWith(mockUser);

    mockData.signup = () => throwError({})
    fixture.detectChanges();
    let spy2 = spyOn(service, 'durationMessage');
    component.signup();
    expect(spy2).toHaveBeenCalledWith('Email already exists');

    mockData.signup = () => throwError('error')
    fixture.detectChanges();
    component.signup();
    expect(spy2).toHaveBeenCalledWith('error');

    component.signupFormGroup.controls['email'].setValue('random');
    component.signupFormGroup.controls['password'].setValue('password');
    component.signupFormGroup.controls['confirmPassword'].setValue('password2');
    fixture.detectChanges();
    component.signup();
    expect(component.signupEmail?.hasError('email')).toBeTruthy();
    expect(component.signupConfirmPassword?.hasError('passwordMismatch')).toBeTruthy();
  });
});
