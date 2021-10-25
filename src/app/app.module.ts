import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './auth';
import { ChatModule } from './chat';
import { MaterialModule } from './material/material.module';
import { AppComponent } from './app.component';

/**
 * Socket server url and configuration options.
 */
const config: SocketIoConfig = { url: 'https://demo-chat-server.on.ag/', options: {} };

/**
 * App Module to bootstrap everything.
 */
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,
    AuthModule,
    BrowserAnimationsModule,
    BrowserModule,
    ChatModule,
    MaterialModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
