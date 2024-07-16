import { Component } from '@angular/core';
import { SessionCardComponent } from '../session-card/session-card.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrl: 'home.component.scss',
  imports: [SessionCardComponent],
  standalone: true,
})
export class HomeComponent {}
