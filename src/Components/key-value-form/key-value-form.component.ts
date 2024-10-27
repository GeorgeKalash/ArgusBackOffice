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
    @Inject(MAT_DIALOG_DATA) public data: { dataset: any },
    public dataService: KVS_Service,
    public dialogService: MatDialog,
    public notifyService: NotificationService
  ) {
    this.form = this.formBuilder.group({
      dataset: [this.data.dataset],
      key: ['', Validators.required],
      value: ['', Validators.required],
      value2: [''],
      value3: [''],
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
    //check if the key has already been added
    var parameters =
      '_key=' + formValue.key + '&_dataset=' + formValue.dataset + '&_language=1';
    var request = {
      service: KeyValueStoreWebService.service,
      extension: KeyValueStoreWebService.getKVS,
      parameters: parameters,
    };
    this.API_Service.getRequest(request)
      .then((data) => {
        if (data.record) {
          this.dialogService.open(AlertDialogComponent, {
            data: {
              title: 'error',
              message: 'Duplicate Key',
            },
          });
        } else {
          const objectsList = this.prepareObjects(formValue);
          objectsList.forEach((element) => {
            var request = {
              service: KeyValueStoreWebService.service,
              extension: KeyValueStoreWebService.setKVS,
            };
            this.API_Service.postRequest(request, element)
              .then((data) => {
                this.dialogRef.close(1);
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
          });
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

  checkForDuplicateKey(inputObj: any): any {}

  prepareObjects(inputObj: any): any[] {
    const result = [];
    if (inputObj.value) {
      result.push({
        dataset: inputObj.dataset,
        language: 1,
        key: inputObj.key,
        value: inputObj.value,
      });
    }
    if (inputObj.value2) {
      result.push({
        dataset: inputObj.dataset,
        language: 2,
        key: inputObj.key,
        value: inputObj.value2,
      });
    }
    if (inputObj.value3) {
      result.push({
        dataset: inputObj.dataset,
        language: 3,
        key: inputObj.key,
        value: inputObj.value3,
      });
    }
    return result;
  }
}
