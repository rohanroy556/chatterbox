import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { ChatComponent, HeaderComponent, MessageComponent, CommandComponent } from './component';

const routes: Routes = [
  { path: '', component: ChatComponent }
];

@NgModule({
  declarations: [
    ChatComponent,
    HeaderComponent,
    MessageComponent,
    CommandComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    ChatComponent,
    HeaderComponent,
    MessageComponent,
    CommandComponent
  ]
})
export class ChatModule { }
