import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    this.chatService.message$.subscribe(message => {
      console.log(message);
    });
    this.chatService.command$.subscribe(command => {
      console.log(command);
    })
    this.sendMessage('Hello!');
    this.sendCommand();
  }

  sendMessage(message: string) {
    this.chatService.sendMessage({ author: 'Rohan', message });
  }

  sendCommand() {
    this.chatService.sendCommand();
  }
}
