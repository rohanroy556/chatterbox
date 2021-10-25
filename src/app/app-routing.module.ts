import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth';

/**
 * App routes where the chat module is lazy loaded.
 */
const routes: Routes = [
  { path: 'chat', canLoad: [AuthGuard], loadChildren: () => import('./chat').then(m => m.ChatModule) },
  { path: '', redirectTo: '/chat', pathMatch: 'full' }
];

/**
 * Module to register all the routes.
 */
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
