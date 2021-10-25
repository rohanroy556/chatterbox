import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatListItem } from '@angular/material/list';
import { AuthService } from 'src/app/auth';
import { Command, CommandType, Message } from 'src/app/model';
import { ChatService } from 'src/app/service';

/**
 * Chat Component is used for the actual chatting. 
 */
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  /**
   * Element references to the template using variables.
   */
  @ViewChild('chatList') chatListElement!: ElementRef;
  @ViewChild('chatInput') chatInputElement!: ElementRef;
  @ViewChildren(MatListItem) matListItems!: QueryList<MatListItem>;
  @ViewChild('map') mapElement!: ElementRef;

  chats: Array<Message> = [];
  command: Command | null = null;
  message: string = '';
  date = new Date();
  get name() { return this.authService.name || ''; }

  constructor(private authService: AuthService, private chatService: ChatService) { }

  /**
   * When component is initialized, subscribe to command and message events.
   * These will be events emitted from the server.
   */
  ngOnInit(): void {
    this.chatService.message$.subscribe(message => {
      message.timestamp = new Date();
      this.chats.push(message);
    });
    this.chatService.command$.subscribe(command => {
      this.command = command;
      if (command.command?.type === CommandType.Map && typeof command.command.data === 'object'
        && !Array.isArray(command.command.data)) {
        this.chats.push({
          author: command.author,
          coordinates: command.command.data,
          message: '',
          timestamp: new Date()
        });
        this.command = null;
      }
    })
  }

  /**
   * After view is initialized in always scroll down to the bottom of chat list.
   * Only scroll down when chat list is changed.
   */
  ngAfterViewInit() {
    this.scrollToBottom();
    this.matListItems.changes.subscribe(() => this.scrollToBottom());
  }

  /**
   * Send command to the server.
   */
  sendCommand() {
    this.chatService.sendCommand();
  }

  /**
   * After each command is processed, emit a message to the server,
   * or logout in case of Yes confirmation to Complete command type.
   * @param text string message or boolean
   */
  sendCommandMessage(text: string | boolean) {
    if (typeof text == 'string') {
      const message = { author: this.name, message: text, timestamp: new Date() };
      this.chatService.sendMessage(message);
      this.chats.push(message);
      this.message = '';
      this.chatInputElement?.nativeElement.focus();
    } else if (text) {
      this.authService.logout();
    }
    this.command = null;
  }

  /**
   * Send message to the server.
   */
  sendMessage() {
    if (this.message) {
      const message = { author: this.name, message: this.message, timestamp: new Date() };
      this.chatService.sendMessage(message);
      this.chats.push(message);
      this.message = '';
      this.chatInputElement?.nativeElement.focus();
    }
  }

  /**
   * Scroll to the bottom of the chat list in a smooth manner.
   */
  scrollToBottom() {
    if (this.chatListElement?.nativeElement) {
      this.chatListElement.nativeElement.scrollTo({
        top: this.chatListElement.nativeElement.scrollHeight,
        behavior: 'smooth'
      });
    }
  }
}
