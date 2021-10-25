import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from 'src/app/auth';
import { MaterialModule } from 'src/app/material/material.module';
import { CommandType, DAYS } from 'src/app/model';
import { CommandComponent } from './command.component';

const mockAuthService = {
  name: 'John Doe',
  logout: () => {}
};

describe('CommandComponent', () => {
  let component: CommandComponent;
  let fixture: ComponentFixture<CommandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommandComponent ],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        MaterialModule
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommandComponent);
    component = fixture.componentInstance;
    component.command = { author: 'test', command: null };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load complete command', () => {
    const command = { author: 'author', command: { type: CommandType.Complete, data: ['Yes', 'No'] } };
    component.command = command;
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.confirm).toEqual(command.command.data);

    component.command = { author: 'author', command: { type: CommandType.Complete, data: [] } };
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.confirm).toEqual(command.command.data);

    const container: HTMLDivElement | null = fixture.debugElement.nativeElement.querySelector('.container'),
      paragraph: HTMLParagraphElement | null = container?.querySelector('p.mat-line') || null,
      buttons = container?.querySelectorAll('button') || [];
    expect(paragraph?.innerHTML.includes('complete the conversation')).toBeTrue();
    expect(buttons[0].querySelector('.label')?.innerHTML).toBe(command.command.data[0]);
    expect(buttons[1].querySelector('.label')?.innerHTML).toBe(command.command.data[1]);

    let spy = spyOn(component.emitMessage, 'emit');
    buttons[0].click();
    expect(spy).toHaveBeenCalledWith(true);

    buttons[1].click();
    expect(spy).toHaveBeenCalledWith(false);
  });

  it('should load date command', () => {
    const command = { author: 'author', command: { type: CommandType.Date, data: new Date('10/18/21').toISOString() } };
    component.command = command;
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.days).toEqual(DAYS);

    component.command = { author: 'author', command: { type: CommandType.Date, data: 'abcd' } };
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.days.length).toBe(5);

    component.command = { author: 'author', command: { type: CommandType.Date, data: new Date('10/23/21').toISOString() } };
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.days).toEqual([DAYS[4], ...DAYS.slice(0, 4)]);

    component.command = { author: 'author', command: { type: CommandType.Date, data: new Date('10/17/21').toISOString() } };
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.days).toEqual(DAYS);

    component.days = DAYS;
    fixture.detectChanges();
    const container: HTMLDivElement | null = fixture.debugElement.nativeElement.querySelector('.container'),
      labels = container?.querySelectorAll('.mat-radio-label-content') || [],
      buttons: NodeListOf<HTMLButtonElement> | never[] = container?.querySelectorAll('.actions button') || [];
    labels.forEach((label, i) => expect(label.textContent?.trim()).toBe(DAYS[i]));
    expect(buttons[0]?.textContent?.trim()).toBe('done');
    expect(buttons[1]?.textContent?.trim()).toBe('close');

    component.selectedDay = DAYS[0];
    fixture.detectChanges();
    let spy = spyOn(component.emitMessage, 'emit');
    buttons[0].click();
    expect(spy).toHaveBeenCalledWith(mockAuthService.name + ' ' + DAYS[0]);

    buttons[1].click();
    expect(spy).toHaveBeenCalledWith(false);
  });

  it('should load rate command', () => {
    const command = { author: 'author', command: { type: CommandType.Rate, data: [1, 5] } };
    component.command = command;
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.ratings).toEqual([1, 2, 3, 4, 5]);

    component.command = { author: 'author', command: { type: CommandType.Rate, data: [] } };
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.ratings).toEqual([1, 2, 3, 4, 5]);

    const container: HTMLDivElement | null = fixture.debugElement.nativeElement.querySelector('.container'),
      paragraph: HTMLParagraphElement | null = container?.querySelector('p.mat-line') || null,
      buttons = container?.querySelectorAll('button') || [];
    expect(paragraph?.innerHTML.includes('rate your experience')).toBeTrue();
    expect(buttons[0]?.textContent?.trim()).toBe('done');
    expect(buttons[1]?.textContent?.trim()).toBe('close');

    component.selectedRate = 3;
    fixture.detectChanges();
    let spy = spyOn(component.emitMessage, 'emit');
    buttons[0].click();
    expect(spy).toHaveBeenCalledWith(`${ mockAuthService.name } has rated this conversion a ${ component.selectedRate }.`);

    buttons[1].click();
    expect(spy).toHaveBeenCalledWith(false);
  });

  it('should get empty name, if no user is logged in', () => {
    mockAuthService.name = '';
    fixture.detectChanges();
    expect(component.name).toBe('');
    mockAuthService.name = 'John Doe';
  });

  it('should emit message as false for invalid commands', () => {
    let spy = spyOn(component.emitMessage, 'emit');
    component.send();
    expect(spy).toHaveBeenCalledWith(false);
  });
});
