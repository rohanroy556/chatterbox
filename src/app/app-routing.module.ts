import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth';

const routes: Routes = [
  { path: 'chat', canLoad: [AuthGuard], loadChildren: () => import('./chat').then(m => m.ChatModule) },
  { path: '', redirectTo: '/chat', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
