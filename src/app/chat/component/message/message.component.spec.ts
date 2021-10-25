import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Message } from 'src/app/model';
import { MessageComponent } from './message.component';
import { MapBrowserEvent } from 'ol';

/**
 * Unit test cases for MessageComponent.
 */
describe('MessageComponent', () => {
  let component: MessageComponent;
  let fixture: ComponentFixture<MessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.point).toEqual([]);
    expect(component.layers).toEqual([]);
    expect(component.overlays).toEqual([]);
  });

  it('should load map data', () => {
    component.message = {
      author: 'author',
      message: '',
      coordinates: {
        lat: 0,
        lng: 0
      },
      timestamp: new Date()
    };
    fixture.detectChanges();
    component.ngAfterViewInit();
    
    expect(component.contentElement.nativeElement).toBeTruthy();
    expect(component.options).toBeTruthy();
    expect(component.map).toBeTruthy();
  });

  it('should load message data', () => {
    const message = {
      author: 'author',
      message: 'message',
      timestamp: new Date()
    };
    component.message = message;
    fixture.detectChanges();
    component.ngAfterViewInit();
    
    expect(component.contentElement.nativeElement.innerHTML).toBe(message.message);
    expect(component.map).toBeFalsy();

    const metaElement = fixture.debugElement.nativeElement.querySelector('.meta'),
      authorElement = metaElement.querySelector('span'),
      timestampElement = metaElement.querySelector('sup');
    expect(authorElement.innerHTML.toLowerCase()).toBe(message.author);
    expect(timestampElement.innerHTML.toLowerCase()).toBeTruthy();

    component.message = null as unknown as Message;
    fixture.detectChanges();
    expect(component.contentElement).toBeFalsy();
  });

  it('should process click event', () => {
    component.message = {
      author: 'author',
      message: '',
      coordinates: {
        lat: 0,
        lng: 0
      },
      timestamp: new Date()
    };
    fixture.detectChanges();
    component.ngAfterViewInit();

    component.clickEvent({
      pixel: component.map.getPixelFromCoordinate([0, 0]),
      coordinate: component.point
    } as MapBrowserEvent<UIEvent>);
    expect(component).toBeTruthy();
  });
});
