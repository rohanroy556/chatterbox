import { Component } from '@angular/core';
import { CommonService } from './service';

/**
 * Application Component where routes are rooted, header component is defined,
 * and a loader is displayed in case of API calls.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(public commonService: CommonService) {}
}
