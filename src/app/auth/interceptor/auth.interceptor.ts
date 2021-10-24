import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { NEVER, Observable } from 'rxjs';
import { AuthService } from '../service';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  addAuthorization(request: HttpRequest<unknown>): HttpRequest<unknown> {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ` + this.authService.token,
        'Content-Type': 'application/json'
      }
    });
    return request;
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return request.url.includes('user/') || request.url.includes('/auth/validate')
      ? next.handle(request)
      : this.authService.isAuthenticated.pipe(switchMap(value => value ? next.handle(this.addAuthorization(request)) : NEVER));
  }
}
