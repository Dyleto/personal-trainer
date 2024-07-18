import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-head-title',
  templateUrl: 'head-title.component.html',
  styleUrl: 'head-title.component.scss',
  standalone: true,
})
export class HeadTitleComponent {
  @Input() text = '';
  @Input() showBackArrow = true;

  constructor(private readonly router: Router) {}

  onClickBackArrow() {
    this.router.navigate(['/']);
  }
}
