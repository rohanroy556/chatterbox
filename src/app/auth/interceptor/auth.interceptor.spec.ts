import { HttpClient, HttpHeaders, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AuthService } from '../service';
import { AuthInterceptor } from './auth.interceptor';

const mockAuthService = {
  token: 'test token',
  isAuthenticated: of(true)
};

describe('AuthInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let interceptor: AuthInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthInterceptor,
        {
          provide: AuthService,
          useValue: mockAuthService
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true
        }
      ]
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    interceptor = TestBed.inject(AuthInterceptor);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('making http calls', () => {
    it('add Authorization header to HTTP request', () => {
      const url = '/test/api';
      mockAuthService.isAuthenticated = of(true);
      http.post(url, {}).subscribe(response => {
        expect(response).toBeTruthy();
      });
      
      const request = httpMock.expectOne(url);
      expect(request.request.headers.get('Authorization')).toEqual(`Bearer ${ mockAuthService.token }`);
      request.flush({});
    });

    it(`not add Authorization header to 'user/' HTTP request`, () => {
      const url = '/user/login';
      http.post(url, {}).subscribe(response => {
        expect(response).toBeTruthy();
      });
      
      const request = httpMock.expectOne(url);
      expect(request.request.headers.has('Authorization')).toBeFalse();
      request.flush({});
    });

    it(`should never make api call without token`, () => {
      const url = '/test/api';
      mockAuthService.isAuthenticated = of(false);
      http.post(url, {}).subscribe(response => {
        expect(response).toBeTruthy();
      });
      
      const request = httpMock.expectNone(url);
      expect(request).toBeFalsy();
    });
  });
});
