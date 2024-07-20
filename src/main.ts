import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));

if (
  !('animate' in document.documentElement) ||
  (navigator && /iPhone OS (8|9|10|11|12|13)_/.test(navigator.userAgent))
) {
  const script = document.createElement('script');
  script.src = 'web-animations-js.js';
  document.head.appendChild(script);
}
