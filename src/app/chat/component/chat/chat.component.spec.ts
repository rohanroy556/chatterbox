import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { AuthService } from 'src/app/auth';
import { MaterialModule } from 'src/app/material/material.module';
import { Command, CommandType, Message } from 'src/app/model';
import { ChatService } from 'src/app/service';
import { CommandComponent } from '../command/command.component';
import { MessageComponent } from '../message/message.component';
import { ChatComponent } from './chat.component';

const mockAuthService = {
  name: 'John Doe',
  logout: () => {}
};
const mockCommand: Command = {
  author: 'Test Author',
  command: null
};
const mockMessage: Message = {
  author: 'Test Author',
  message: 'Random Message',
  timestamp: new Date()
};
const mockChatService = {
  command$: of(mockCommand),
  message$: of(mockMessage),
  sendCommand: () => {},
  sendMessage: () => {}
}

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ChatComponent,
        CommandComponent,
        MessageComponent
      ],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        MaterialModule
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ChatService, useValue: mockChatService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
