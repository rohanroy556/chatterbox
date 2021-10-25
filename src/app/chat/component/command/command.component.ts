import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/auth';
import { Command, CommandType, DAYS } from 'src/app/model';

/**
 * Component Component is used to process commands sent from the server.
 */
@Component({
  selector: 'app-command',
  templateUrl: './command.component.html',
  styleUrls: ['./command.component.scss']
})
export class CommandComponent implements OnInit {
  /**
   * Command input from parent component
   */
  @Input() command!: Command;
  /**
   * Message event to be emitted to parent component.
   */
  @Output() emitMessage: EventEmitter<string | boolean> = new EventEmitter();

  confirm: Array<string> = ['Yes', 'No'];
  days: Array<string> = [];
  selectedDay: string = '';
  ratings: Array<number> = [1, 2, 3, 4, 5];
  selectedRate: number = 0;
  get name() { return this.authService.name || ''; }
  get type() { return this.command.command?.type; }
  get commandType() { return CommandType; }

  constructor(private authService: AuthService) { }

  /**
   * Initialize data to be rendered in the template.
   * Different command types have different data types and is process respectively.
   */
  ngOnInit(): void {
    const data = this.command.command?.data;
    if (this.type === CommandType.Complete && Array.isArray(data)) {
      this.confirm = data.length == 2 ? data.map(k => k.toString()): ['Yes', 'No'];
    } else if (this.type === CommandType.Date && typeof data == 'string') {
      const date = new Date(data).toString() !== "Invalid Date" ? new Date(data) : new Date();
      let day = date.getDay() - 1;
      day = day < 0 ? 0 : day > 4 ? 4 : day;
      this.days = [...Array(5)].map(d => DAYS[(day++) % 5]);
    } else if (this.type === CommandType.Rate && Array.isArray(data)) {
      let [i, j] = data;
      this.ratings = typeof i === 'number' && typeof j === 'number'
        ? [...Array(j - i + 1)].map((_, k) => (typeof i == 'number' ? i : 0) + k)
        : [1, 2, 3, 4, 5];
    }
  }

  /**
   * Emit message event with respect to command type and the selection made by the user.
   */
  send() {
    this.emitMessage.emit(this.type === CommandType.Complete ? true
      : this.type === CommandType.Date ? this.name + ' ' + this.selectedDay
      : this.type === CommandType.Rate ? `${ this.name } has rated this conversion a ${ this.selectedRate }.` : false);
  }

  /**
   * Emit false in case user has cancelled and don't want to emit any messages.
   */
  cancel() {
    this.emitMessage.emit(false);
  }
}
