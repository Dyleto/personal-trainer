import { Component } from '@angular/core';
import { SessionCardComponent } from '../session-card/session-card.component';
import { Router } from '@angular/router';
import { HeadTitleComponent } from '../head-title/head-title.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrl: 'home.component.scss',
  imports: [SessionCardComponent, HeadTitleComponent],
  standalone: true,
})
export class HomeComponent {
  constructor(private readonly router: Router) {}

  onClickChooseSession() {
    this.router.navigate(['/program']);
  }
}
