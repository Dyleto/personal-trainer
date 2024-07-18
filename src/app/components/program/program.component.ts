import { Component } from '@angular/core';
import { HeadTitleComponent } from '../head-title/head-title.component';
import { SessionCardComponent } from '../session-card/session-card.component';
import { BackArrowComponent } from '../back-arrow/back-arrow.component';

@Component({
  selector: 'app-program',
  templateUrl: 'program.component.html',
  styleUrl: 'program.component.scss',
  standalone: true,
  imports: [HeadTitleComponent, SessionCardComponent, BackArrowComponent],
})
export class ProgramComponent {}
