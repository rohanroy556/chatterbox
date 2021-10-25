import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Component, Inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { CommonService } from 'src/app/service';
import { User } from '..';
import { AuthComponent } from '../component';
import { AuthService } from './auth.service';

const commonService = {
  loader: false,
  durationMessage: (message: string, duration?: number, h?: any, v?: any) => {}
}
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJhbmRvbUBleGFtcGxlLmNvbSIsIm5hbWUiOiJKb2huIERvZSJ9.h1rztIET9qhX61oMbq7Fd6pnvnKn7NnDrBNZftiIY28';
const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJhbmRvbUBleGFtcGxlLmNvbSIsIm5hbWUiOiJKb2huIERvZSIsImV4cCI6MH0.S68tFSW0h_9_M42zPuZacERj3iFIUQ9eHDR1tvFpsTc';
const mockUser: User = { _id: 'id', email: 'random@example.com', token, name: 'John Doe' };

const mockMatDialog = {
  open: () => ({ afterClosed: () => of(mockUser) })
};

@Component({})
class MockAuthComponent {
  constructor() {}
}

/**
 * Unit test cases for AuthService.
 */
describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let dialog: MatDialog;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthComponent],
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        MaterialModule,
        RouterTestingModule.withRoutes([{ path: 'chat', component: MockAuthComponent }])
      ],
      providers:[
        { provide: AuthComponent, useClass: MockAuthComponent },
        { provide: CommonService, useValue: commonService },
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: MatDialogRef, useValue: mockMatDialog.open() },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    dialog = TestBed.inject(MatDialog);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('validate token', () => {
    let spy = spyOn(service, 'authenticate').and.callThrough();
    service.clear();
    service.isAuthenticated.subscribe(value => expect(value).toBeFalse());
    expect(spy).toHaveBeenCalled();
    expect(service.user).toEqual(mockUser);

    service.token = expiredToken;
    service.isAuthenticated.subscribe(value => expect(value).toBeTrue());
    let request = httpMock.expectOne(req => req.url.includes('/auth/validate'));
    request.flush(true);

    service.token = expiredToken;
    service.isAuthenticated.subscribe(value => expect(value).toBeFalse());
    request = httpMock.expectOne(req => req.url.includes('/auth/validate'));
    request.error(new ErrorEvent(''));

    service.token = token;
    service.isAuthenticated.subscribe(value => expect(value).toBeTrue());
    expect(service.id).toEqual(mockUser._id);
    expect(service.email).toEqual(mockUser.email);
    expect(service.token).toEqual(mockUser.token);
    expect(service.name).toEqual(mockUser.name);
  });

  it('should login', () => {
    service.login('email', 'password').subscribe(user => expect(user).toEqual(mockUser));
    let request = httpMock.expectOne(req => req.url.includes('/user/login'));
    request.flush(mockUser);

    service.login('', '').subscribe(
      () => fail('Expected Error'),
      error => expect(error).toBe('Email and Password is required')
    );
    httpMock.expectNone(req => req.url.includes('/user/login'));

    service.login('email', 'password').subscribe(
      () => fail('Expected Error'),
      error => expect(error).toBeTruthy()
    );
    request = httpMock.expectOne(req => req.url.includes('/user/login'));
    request.error(new ErrorEvent('Some Error'), { status: 500 });
  });

  it('should signup', () => {
    service.signup('email', 'password', 'name').subscribe(user => expect(user).toEqual(mockUser));
    let request = httpMock.expectOne(req => req.url.includes('/user/signup'));
    request.flush(mockUser);

    service.signup('', '', '').subscribe(
      () => fail('Expected Error'),
      error => expect(error).toBe('Email, Password and Name is required')
    );
    httpMock.expectNone(req => req.url.includes('/user/signup'));

    service.signup('email', 'password', 'name').subscribe(
      () => fail('Expected Error'),
      error => expect(error).toBeTruthy()
    );
    request = httpMock.expectOne(req => req.url.includes('/user/signup'));
    request.error(new ErrorEvent('Some Error'), { status: 500 });
  });

  it('should authenticate', () => {
    const spy = spyOn(dialog, 'open').and.callThrough();
    service.authenticate();
    expect(spy).toHaveBeenCalled();
  });

  it('should logout', () => {
    const spy = spyOn(service, 'authenticate');
    service.logout();
    expect(spy).toHaveBeenCalled();
  });
});
