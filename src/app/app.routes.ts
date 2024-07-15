import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProgramComponent } from './components/program/program.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'program',
    component: ProgramComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
