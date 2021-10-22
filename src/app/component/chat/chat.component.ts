import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatListItem } from '@angular/material/list';
import { Command, CommandType, Message } from 'src/app/model';
import { ChatService } from 'src/app/service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @ViewChild('chatList') chatListElement!: ElementRef;
  @ViewChild('chatInput') chatInputElement!: ElementRef;
  @ViewChildren(MatListItem) matListItems!: QueryList<MatListItem>;
  @ViewChild('map') mapElement!: ElementRef;
  name = 'Ronny';
  chats: Array<Message> = [];
  command: Command | null = null;
  message: string = '';
  date = new Date();

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    this.chatService.message$.subscribe(message => {
      message.timestamp = new Date();
      this.chats.push(message);
    });
    this.chatService.command$.subscribe(command => {
      console.log(command);
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

  ngAfterViewInit() {
    this.scrollToBottom();
    this.matListItems.changes.subscribe(() => this.scrollToBottom());
  }

  sendCommand() {
    this.chatService.sendCommand();
  }

  sendCommandMessage(text: string | boolean) {
    if (typeof text == 'string') {
      const message = { author: this.name, message: text, timestamp: new Date() };
      this.chatService.sendMessage(message);
      this.chats.push(message);
      this.message = '';
      this.chatInputElement?.nativeElement.focus();
    } else if (text) {

    }
    this.command = null;
  }

  sendMessage() {
    if (this.message) {
      const message = { author: this.name, message: this.message, timestamp: new Date() };
      this.chatService.sendMessage(message);
      this.chats.push(message);
      this.message = '';
      this.chatInputElement?.nativeElement.focus();
    }
  }

  scrollToBottom() {
    if (this.chatListElement?.nativeElement) {
      this.chatListElement.nativeElement.scrollTo({
        top: this.chatListElement.nativeElement.scrollHeight,
        behavior: 'smooth'
      });
    }
  }
}
