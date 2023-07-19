import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { KVS_Service } from 'src/KVS_service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { KeyValueStoreWebService } from 'src/WebServices/KeyValueStoreWebService';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { NotificationService } from 'src/Services/notification.service';
import { KeyValues } from 'src/models/KeyValues';

@Component({
  selector: 'app-data-sets-form',
  templateUrl: './key-value-form.component.html',
  styleUrls: ['./key-value-form.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDialogModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
  ],
})
export class KeyValueFormComponent {
  constructor(
    private API_Service: KVS_Service,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<KeyValueFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: KeyValues,
    public dataService: KVS_Service,
    public dialogService: MatDialog,
    public notifyService: NotificationService
  ) {
    this.form = this.formBuilder.group({
      dataset: [''],
      language: ['1'],
      key: ['', Validators.required],
      value: ['', Validators.required],
    });
  }

  form: FormGroup;

  formControl = new FormControl('', [
    Validators.required,
    // Validators.email,
  ]);

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' : '';
  }

  submit() {
    // emppty stuff
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public confirmAdd(): void {
    const formValue = this.form.value;
    var request = {
      service: KeyValueStoreWebService.service,
      extension: KeyValueStoreWebService.setKVS,
    };
    this.API_Service.postRequest(request, formValue)
      .then((data) => {
        this.dialogRef.close(1);
        console.log(data);
        this.notifyService.showSuccess(
          'Record Saved Successfully',
          'Success'
        );
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
}
