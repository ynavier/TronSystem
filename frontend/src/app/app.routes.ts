import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { ProductListComponent } from './components/product-list/product-list.component';

export const routes: Routes = [
  { path: '',         component: LandingComponent },
  { path: 'inventory', component: ProductListComponent },
  { path: '**',       redirectTo: '' }
];