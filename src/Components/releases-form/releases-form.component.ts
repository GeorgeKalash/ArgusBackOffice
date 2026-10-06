import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

import { Component, Inject } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { KVS_Service } from 'src/KVS_service';
import { KeyValueStoreWebService } from 'src/WebServices/KeyValueStoreWebService';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { NotificationService } from 'src/Services/notification.service';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';

import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-releases-form',
  templateUrl: './releases-form.component.html',
  styleUrls: ['./releases-form.component.scss'],

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    MatFormFieldModule,
    MatDialogModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,

    MatDatepickerModule,
    MatNativeDateModule,
  ],
})
export class ReleasesFormComponent {

  form: FormGroup;

  constructor(
    private API_Service: KVS_Service,
    private formBuilder: FormBuilder,

    public dialogRef: MatDialogRef<ReleasesFormComponent>,

    @Inject(MAT_DIALOG_DATA)
    public data: {
      mode: 'add' | 'edit';
      release: any;
    },

    public dialogService: MatDialog,
    public notifyService: NotificationService
  ) {

    this.form = this.formBuilder.group({
      release: ['', Validators.required],
      date: [new Date(), Validators.required],
      notes: ['', Validators.required],
    });

    // If we're editing, populate the form
    if (this.data.mode === 'edit' && this.data.release) {

      this.form.patchValue({
        release: this.data.release.release,
        date: this.data.release.date,
        notes: this.data.release.notes,
      });

      // Don't allow changing the release identifier
      this.form.get('release')?.disable();
    }
  }


  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);

    return control?.hasError('required')
      ? 'Required field'
      : '';
  }


  submit(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.data.mode === 'add') {
      this.addRelease();
    } else {
      this.updateRelease();
    }
  }


  private addRelease(): void {

    const formValue = this.form.getRawValue();

    const parameters = '_release=' + formValue.release;

    const request = {
      service: KeyValueStoreWebService.service,
      extension: KeyValueStoreWebService.getRelease,
      parameters: parameters,
    };

    this.API_Service.getRequest(request)
      .then((data) => {

        if (data.record) {

          this.dialogService.open(AlertDialogComponent, {
            data: {
              title: 'Error',
              message: 'Duplicate Release',
            },
          });

          return;
        }

        this.saveRelease(formValue);
      })
      .catch((error) => {

        this.dialogService.open(AlertDialogComponent, {
          data: {
            title: error.status + ' ' + error.name,
            message: error.error.error,
          },
        });

      });
  }


  private updateRelease(): void {

    const formValue = this.form.getRawValue();

    const request = {
      service: KeyValueStoreWebService.service,
      extension: KeyValueStoreWebService.setRelease,
    };

    this.API_Service.postRequest(request, formValue)
      .then((data) => {

        if (data != null) {

          this.notifyService.showSuccess(
            'Record Updated Successfully',
            'Success'
          );

          this.dialogRef.close(1);
        }

      })
      .catch((error) => {

        this.dialogService.open(AlertDialogComponent, {
          data: {
            title: error.status + ' ' + error.name,
            message: error.error.error,
          },
        });

      });
  }


  private saveRelease(formValue: any): void {

    const request = {
      service: KeyValueStoreWebService.service,
      extension: KeyValueStoreWebService.setRelease,
    };

    this.API_Service.postRequest(request, formValue)
      .then((data) => {

        if (data != null) {

          this.notifyService.showSuccess(
            'Record Saved Successfully',
            'Success'
          );

          this.dialogRef.close(1);
        }

      })
      .catch((error) => {

        this.dialogService.open(AlertDialogComponent, {
          data: {
            title: error.status + ' ' + error.name,
            message: error.error.error,
          },
        });

      });
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

}