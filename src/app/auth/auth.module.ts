import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthInterceptor } from './interceptor';
import { AuthGuard } from './guard';
import { AuthService } from './service';
import { AuthComponent } from './component';
import { MaterialModule } from '../material/material.module';

/**
 * Authentication Module for the application.
 * Route Guard, Intercept HTTP requests, Authenticate User and Check JWT token.
 */
@NgModule({
  declarations: [
    AuthComponent
  ],
  entryComponents: [
    AuthComponent
  ],
  exports: [
    AuthComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    JwtModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthGuard,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class AuthModule { }
