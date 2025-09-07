import { Routes } from '@angular/router';
import { TrainingComponent } from './training/training.component';
import { SimulationComponent } from './simulation/simulation.component';
import { DatesComponent } from './dates/dates.component';
import { UploadComponent } from './upload/upload.component';

export const routes: Routes = [
  { path: '', component: UploadComponent },
  { path: 'upload', component: UploadComponent }, // or your landing page
  { path: 'dates', component: DatesComponent },
  { path: 'training', component: TrainingComponent },
  { path: 'simulation', component: SimulationComponent }, // <-- THIS IS REQUIRED
];
