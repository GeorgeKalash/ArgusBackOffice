
import { Routes } from '@angular/router';
import { DataSetsComponent } from '../Components/data-sets/data-sets.component';
import { TranslatorsComponent } from '../Components/translators/translators.component';
import { SignInComponent } from '../Components/sign-in/sign-in.component';

export const appRoutes: Routes = [
  { path: 'dataSets', component: DataSetsComponent },
  { path: 'translators', component: TranslatorsComponent },
  { path: 'signin', component: SignInComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }, //The pathMatch tells the Router how to match the URL.
//   { path: '**', component: PageNotFoundComponent } //The “**” matches every URL
];

