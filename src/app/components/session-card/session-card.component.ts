import { Component, Input } from '@angular/core';
import { ExercisesListComponent } from './exercises-list/exercises-list.component';

@Component({
  selector: 'app-session-card',
  templateUrl: 'session-card.component.html',
  styleUrl: 'session-card.component.scss',
  standalone: true,
  imports: [ExercisesListComponent],
})
export class SessionCardComponent {
  @Input() nextSession = false;
}
