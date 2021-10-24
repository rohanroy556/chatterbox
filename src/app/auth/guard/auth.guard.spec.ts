import { TestBed } from '@angular/core/testing';
import { Route } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../service';
import { Observable, of } from 'rxjs';

const mockAuthService = {
  isAuthenticated: of(true)
};

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ]
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('guard routes', () => {
    let route: Route = { path: 'mock' }, load = guard.canLoad(route, []);
    expect(load instanceof Observable).toBeTrue();
    if (load instanceof Observable) {
      load.subscribe(result => expect(result).toBeTrue());
    }

    mockAuthService.isAuthenticated = of(false);
    route = { path: 'mock2' };
    load = guard.canLoad(route, []);
    expect(load instanceof Observable).toBeTrue();
    if (load instanceof Observable) {
      load.subscribe(result => expect(result).toBeFalse());
    }
  });
});
