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
import { Datasets } from 'src/models/Datasets';
import { KVS_Service } from 'src/KVS_service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { KeyValueStoreWebService } from 'src/WebServices/KeyValueStoreWebService';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-data-sets-form',
  templateUrl: './data-sets-form.component.html',
  styleUrls: ['./data-sets-form.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    CommonModule,
  ],
})
export class DataSetsFormComponent {
  constructor(
    private API_Service: KVS_Service,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DataSetsFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Datasets,
    public dataService: KVS_Service,
    public dialogService: MatDialog
  ) {
    this.form = this.formBuilder.group({
      datasetId: ['', Validators.required],
      name: ['', Validators.required],
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
    //console.log(formValue);
    var request = {
      service: KeyValueStoreWebService.service,
      extension: KeyValueStoreWebService.setDataset,
    };
    this.API_Service.postRequest(request, formValue)
      .then((data) => {
        console.log(data);
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
