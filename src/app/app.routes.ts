
import { Routes } from '@angular/router';
import { DataSetsComponent } from '../Components/data-sets/data-sets.component';
import { TranslatorsComponent } from '../Components/translators/translators.component';
import { LoggingComponent } from '../Components/logging/logging.component';
import { SignInComponent } from '../Components/sign-in/sign-in.component';
import { KeyValue1Component } from '../Components/key-value1/key-value1.component';
import { ReportTemplatesComponent } from 'src/Components/report-templates/report-templates.component';
import { KeyValuesComponent } from 'src/Components/keyValuesList/keyvalues.component';

export const appRoutes: Routes = [
  { path: 'logging', component: LoggingComponent },
  { path: 'dataSets', component: DataSetsComponent },
  { path: 'keyValues', component: KeyValuesComponent },
  { path: 'translators', component: TranslatorsComponent },
  { path: 'signin', component: SignInComponent },
  { path: 'kvs/:id', component: KeyValue1Component },
  { path: 'reportTemplates', component: ReportTemplatesComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }, //The pathMatch tells the Router how to match the URL.
//   { path: '**', component: PageNotFoundComponent } //The “**” matches every URL
];

