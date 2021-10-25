import { ElementRef, EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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

const command$ = new EventEmitter();
const message$ = new EventEmitter();
const mockChatService = {
  command$: command$.asObservable(),
  message$: message$.asObservable(),
  sendCommand: () => {},
  sendMessage: () => {}
}

/**
 * Unit test cases for ChatComponent.
 */
describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let authService: AuthService;
  let chatService: ChatService;

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
    authService = TestBed.inject(AuthService);
    chatService = TestBed.inject(ChatService);
    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    mockCommand.command = null;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit command', () => {
    const spy = spyOn(chatService, 'sendCommand').and.callThrough();
    const chatInput: HTMLDivElement | null = fixture.debugElement.nativeElement.querySelector('.chat-container .chat-input'),
      command: HTMLButtonElement | null = chatInput?.querySelector('.mat-raised-button') || null;
    command?.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();

    command$.emit(mockCommand);
    fixture.detectChanges();
    expect(component.command).toEqual(mockCommand);
  });

  it('should process map command received', () => {
    const command = { type: CommandType.Map, data: { lat: 0, lng: 0 } };
    mockCommand.command = command;
    command$.emit(mockCommand);
    fixture.detectChanges();
    expect(component.command).toBeNull();

    const received = component.chats[component.chats.length - 1];
    expect(received?.author).toEqual(mockMessage.author);
    expect(received?.message).toBe('');
    expect(received?.coordinates).toEqual(command.data);
  });

  it('should send message', () => {
    const spy = spyOn(chatService, 'sendMessage').and.callThrough();
    const chatInput: HTMLDivElement | null = fixture.debugElement.nativeElement.querySelector('.chat-container .chat-input'),
      input = chatInput?.querySelector('input') || null,
      message: HTMLButtonElement | null = chatInput?.querySelector('.mat-mini-fab') || null;
    if (input) {
      input.value = 'hi';
      input.dispatchEvent(new Event('input'));
    }
    fixture.detectChanges();
    message?.click();

    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();

    component.sendMessage();
    expect(spy).toHaveBeenCalledTimes(1);

    message$.emit(mockMessage);
    fixture.detectChanges();
    const received = component.chats[component.chats.length - 1];
    expect(received?.author).toEqual(mockMessage.author);
    expect(received?.message).toEqual(mockMessage.message);
  });

  it('should send command message', () => {
    const spy = spyOn(chatService, 'sendMessage');
    component.sendCommandMessage('test')
    expect(spy).toHaveBeenCalled();
    expect(component.command).toBeNull();
    const received = component.chats[component.chats.length - 1];
    expect(received?.author).toEqual(mockAuthService.name);
    expect(received?.message).toBe('test');

    const spy2 = spyOn(authService, 'logout');
    component.sendCommandMessage(true);
    expect(spy2).toHaveBeenCalled();

    component.sendCommandMessage(false);
    expect(spy2).toHaveBeenCalledTimes(1);
  });

  it('should scroll to bottom', () => {
    const spy = spyOn(component.chatListElement.nativeElement, 'scrollTo');
    component.scrollToBottom();
    expect(spy).toHaveBeenCalled();

    component.chatListElement = null as unknown as ElementRef;
    component.scrollToBottom();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should get empty name, if no user is logged in', () => {
    mockAuthService.name = '';
    fixture.detectChanges();
    expect(component.name).toBe('');
    mockAuthService.name = 'John Doe';
  });
});
