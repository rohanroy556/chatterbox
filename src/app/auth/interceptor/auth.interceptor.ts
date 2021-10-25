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

/**
 * HTTP Request Interceptor to add header to the API request.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  /**
   * Add Authorization token and Content-Type headers to an existing request.
   * @param request to be processed
   * @returns cloned request with added headers
   */
  addAuthorization(request: HttpRequest<unknown>): HttpRequest<unknown> {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ` + this.authService.token,
        'Content-Type': 'application/json'
      }
    });
    return request;
  }

  /**
   * Intercept all API requests.
   * @param request to be processed
   * @param next HTTP handler
   * @returns HTTP event observable with same or modified request
   */
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return request.url.includes('user/') || request.url.includes('/auth/validate')
      ? next.handle(request)
      : this.authService.isAuthenticated.pipe(switchMap(value => value ? next.handle(this.addAuthorization(request)) : NEVER));
  }
}
