import { TestBed } from '@angular/core/testing';
import { Socket, SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { EventName } from '../model';
import { ChatService } from './chat.service';

const config: SocketIoConfig = { url: 'https://demo-chat-server.on.ag/', options: {} };

/**
 * Unit Test cases for ChatService.
 */
describe('ChatService', () => {
  let service: ChatService;
  let socket: Socket;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SocketIoModule.forRoot(config)]
    });
    service = TestBed.inject(ChatService);
    socket = TestBed.inject(Socket);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send and receive message', (done) => {
    const message = { author: 'test', message: 'test message', timestamp: new Date() };
    const spy = spyOn(socket, 'emit').and.callFake((name, response) => {
      expect(name).toEqual(EventName.Message);
      expect(response).toEqual(message);
      done();
    });
    service.sendMessage(message);
    expect(spy).toHaveBeenCalled();
  });

  it('should send and receive command', (done) => {
    const spy = spyOn(socket, 'emit').and.callFake(name => {
      expect(name).toEqual(EventName.Command);
      done();
    });
    service.sendCommand();
    expect(spy).toHaveBeenCalled();
  });
});
