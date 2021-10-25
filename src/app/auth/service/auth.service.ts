import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CommonService } from 'src/app/service';
import { StorageKeys, User } from '../auth.model';
import { AuthComponent } from '../component';

const jwtHelper = new JwtHelperService();

/**
 * Authentication Service for the entire app.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
	baseUrl: string = window.location.origin;

  /**
   * User object stored and retrieved from Session Storage of the browser.
   */
  _user: User | null = null;
  get user() {
    this._user = this._user ? this._user : this.id && this.email && this.name && this.token
      ? { _id: this.id, email: this.email, name: this.name, token: this.token } : null;
    return this._user;
  }
  set user(user) {
    this.id = user?._id || null;
    this.email = user?.email || null;
    this.name = user?.name || null;
    this.token = user?.token || null;
    this._user = user;
  }
  get id(): string | null {
    return sessionStorage.getItem(StorageKeys.Id);
  }
  set id(id: string | null) {
    id ? sessionStorage.setItem(StorageKeys.Id, id) : sessionStorage.removeItem(StorageKeys.Id);
  }
  get email(): string | null {
    return sessionStorage.getItem(StorageKeys.Email);
  }
  set email(email: string | null) {
    email ? sessionStorage.setItem(StorageKeys.Email, email) : sessionStorage.removeItem(StorageKeys.Email);
  }
  get name(): string | null {
    return sessionStorage.getItem(StorageKeys.Name);
  }
  set name(name: string | null) {
    name ? sessionStorage.setItem(StorageKeys.Name, name) : sessionStorage.removeItem(StorageKeys.Name);
  }
  get token(): string | null {
    return sessionStorage.getItem(StorageKeys.Token);
  }
  set token(token: string | null) {
    token ? sessionStorage.setItem(StorageKeys.Token, token) : sessionStorage.removeItem(StorageKeys.Token);
  }

  /**
   * JWT token is valid or not.
   */
  get hasValidToken(): boolean {
    return this.token ? !jwtHelper.isTokenExpired(this.token) : false;
  }
  /**
   * User is authenticated by validating the JWT token.
   */
  get isAuthenticated(): Observable<boolean> {
    return this.hasValidToken ? of(this.hasValidToken) : this.validateToken();
  }

  constructor(
    private commonService: CommonService,
    private dialog: MatDialog,
    private http: HttpClient,
    private router: Router
  ) { }

  /**
   * Validate the JWT token by hitting the Node API.
   * This is done to validate the signature of the token.
   * @returns a boolean observable indicating the token is valid or not
   */
  validateToken(): Observable<boolean> {
    this.commonService.loader = true;
    if (!this.token) {
      this.authenticate();
      return of(false);
    }
    return this.http.get<boolean>(
      this.baseUrl + '/auth/validate',
      { headers: { Authorization: `Bearer ` + this.token } }
    ).pipe(
      map(() => {
        this.commonService.loader = false;
        return true;
      }),
      catchError(error => {
        this.commonService.loader = false;
        this.authenticate();
        return of(false);
      })
    );
  }

  /**
   * Login an existing user.
   * Retrieve a user object that contains name, email and JWT token.
   * @param email of the user
   * @param password of the user
   * @returns a user object observable
   */
  login(email: string, password: string): Observable<User> {
    if (!email || !password) return throwError('Email and Password is required');
    this.commonService.loader = true;
    return this.http.post<User>(
      this.baseUrl + '/user/login', { email, password }
    ).pipe(
      map(user => {
        this.commonService.loader = false;
        return user;
      }),
      catchError(error => {
        this.commonService.loader = false;
        return throwError(error);
      })
    );
  }

  /**
   * Sign-Up a new user.
   * Retrieve a user object that contains name, email and JWT token.
   * @param email of the user
   * @param password of the user
   * @param name of the user
   * @returns a user object observable
   */
  signup(email: string, password: string, name: string): Observable<User> {
    if (!email || !password || !name) return throwError('Email, Password and Name is required');
    this.commonService.loader = true;
    return this.http.post<User>(
      this.baseUrl + '/user/signup', { email, password, name }
    ).pipe(
      map(user => {
        this.commonService.loader = false;
        return user;
      }),
      catchError(error => {
        this.commonService.loader = false;
        return throwError(error);
      })
    );
  }

  /**
   * Open a dialop window two tabs: Login and Sign-Up.
   * Dialog returns a user object after it is closed.
   * Note: login() and signup() functions injected as data to avoid circular dependency.
   */
  authenticate() {
    this.clear();
    this.dialog.open(AuthComponent, {
      disableClose: true,
      minWidth: 500,
      minHeight: 50,
      hasBackdrop: true,
      closeOnNavigation: false,
      data: {
        login: (email: string, password: string) => this.login(email, password),
        signup: (email: string, password: string, name: string) => this.signup(email, password, name)
      }
    }).afterClosed().subscribe((user: User) => {
      this.user = user;
      this.commonService.durationMessage(`Welcome ${ user.name }!`);
      this.router.navigate(['chat']);
    });
  }

  /**
   * Assign null to existing user object and clear all storages
   */
  clear() {
    this.user = null;
    sessionStorage.clear();
    localStorage.clear();
  }

  /**
   * Logout from application and emit a message.
   */
  logout() {
    this.authenticate();
    this.commonService.durationMessage(`Logged Out!`);
  }
}
