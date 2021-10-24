import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth';

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
