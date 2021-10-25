import { Injectable } from '@angular/core';
import { UrlTree, CanLoad, Route, UrlSegment, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../service';

/**
 * Guard routes to allow access to only authenticated users.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Loads only if user is authenticated.
   * @param route accessed
   * @param segments of the route
   * @returns boolean to indicate if route access is allowed or not
   */
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.isAuthenticated;
  }  
}
