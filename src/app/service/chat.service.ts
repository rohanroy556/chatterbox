import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Command, EventName, Message } from '../model';

/**
 * Chat Service to send and receive, messages and commands.
 * Messages and commands emitted by server can be subscribed.
 */
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  /**
   * Observable that emits message events from server.
   */
  message$ = this.socket.fromEvent<Message>(EventName.Message);
  /**
   * Observable that emits command events from server.
   */
  command$ = this.socket.fromEvent<Command>(EventName.Command);

  constructor(private socket: Socket) { }

  /**
   * Emit message to server.
   * @param message object that contains message to be sent by the user
   */
  sendMessage(message: Message) {
    this.socket.emit(EventName.Message, message);
  }

  /**
   * Emit command to server.
   */
  sendCommand() {
    this.socket.emit(EventName.Command);
  }
}
