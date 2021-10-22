import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material/material.module';
import { AppComponent } from './app.component';
import { ChatComponent, CommandComponent, HeaderComponent, MessageComponent } from './component';

const config: SocketIoConfig = { url: 'https://demo-chat-server.on.ag/', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    HeaderComponent,
    MessageComponent,
    CommandComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    MaterialModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
