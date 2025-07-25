import { RouterModule } from '@angular/router';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxSpinnerModule } from 'ngx-spinner';

import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {NgFor} from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//added components
import { DataSetsComponent } from '../Components/data-sets/data-sets.component';
import { TranslatorsComponent } from '../Components/translators/translators.component';
import { LoggingComponent } from '../Components/logging/logging.component';
import { KeyValuesComponent } from '../Components/keyValuesList/keyvalues.component';
import { SignInComponent } from '../Components/sign-in/sign-in.component';
import { LoaderComponent } from '../Components/loader/loader.component';
import { AlertDialogComponent } from '../Components/alert-dialog/alert-dialog.component';


import { appRoutes } from './app.routes';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { ToastrModule } from 'ngx-toastr';
import { LoaderService } from 'src/Services/LoaderService';
import { ConfirmationDialogComponent } from 'src/Components/confirmation-dialog/confirmation-dialog.component';
import { ReportTemplatesComponent } from 'src/Components/report-templates/report-templates.component';

@NgModule({
  declarations: [
    AppComponent,
    TranslatorsComponent,
    LoggingComponent,
    KeyValuesComponent,
    SignInComponent,
    LoaderComponent,
    AlertDialogComponent,
    ConfirmationDialogComponent,
    ReportTemplatesComponent
  ],
  imports: [
    BrowserModule,
    NgxSpinnerModule,
    HttpClientModule,
    AppRoutingModule,
    MatTableModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    NgFor,
    MatPaginatorModule,
    MatFormFieldModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatPaginatorModule,
    FlexLayoutModule,
    MatDialogModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [LoaderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
