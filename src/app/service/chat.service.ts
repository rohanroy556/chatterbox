import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Command, EventName, Message } from '../model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  message$ = this.socket.fromEvent<Message>(EventName.Message);
  command$ = this.socket.fromEvent<Command>(EventName.Command);

  constructor(private socket: Socket) { }

  sendMessage(message: Message) {
    this.socket.emit(EventName.Message, message);
  }

  sendCommand() {
    this.socket.emit(EventName.Command);
  }
}
