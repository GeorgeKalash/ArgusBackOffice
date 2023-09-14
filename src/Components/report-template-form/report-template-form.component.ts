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
  selector: 'app-report-template-form',
  templateUrl: './report-template-form.component.html',
  styleUrls: ['./report-template-form.component.scss'],
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
export class ReportTemplateFormComponent {
  constructor(
    private API_Service: KVS_Service,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ReportTemplateFormComponent>,
    public dataService: KVS_Service,
    public dialogService: MatDialog,
    public notifyService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: { resourceId: any }
  ) {
    this.form = this.formBuilder.group({
      resourceId: [this.data.resourceId],
      layoutId: ['', Validators.required],
      fileName: ['', Validators.required],
    });
  }

  form: FormGroup;

  formControl = new FormControl('', [
    Validators.required,
    // Validators.email,
  ]);
  selectedFile: File | null = null;

  onFileSelected(event: any) {
    const fileInput = event.target;
    const fullPath = fileInput.value;
    const fileName = fullPath.replace(/^.*[\\\/]/, ''); // Extract the filename

    // Set the value of the 'fileName' form control
    this.form.get('fileName')?.setValue(fileName);
    // Get the selected file
    this.selectedFile = event.target.files[0];
  }

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
      extension: KeyValueStoreWebService.setAttachment,
    };
    this.API_Service.postRequestAttachment(
      request,
      formValue,
      this.selectedFile
    )
      .then((data) => {
        this.dialogRef.close(1);
        this.notifyService.showSuccess('Record Saved Successfully', 'Success');
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
