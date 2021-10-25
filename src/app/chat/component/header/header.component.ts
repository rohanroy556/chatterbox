import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth';

/**
 * Header Component for the entire application.
 * User can log out by clicking on the logout button.
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  title = 'ChatterBox';

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }
}
