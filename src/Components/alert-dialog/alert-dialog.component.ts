import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss']
})
export class AlertDialogComponent {
  message: string = 'An unspecified error has occurred';
  title: string = 'title';
  buttonText = 'Ok';

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: {
      message: string;
      title: string;
      buttonText: string;
    },
    private dialogRef: MatDialogRef<AlertDialogComponent>
  ) {
    if (data?.title) this.title = data.title;
    if (data?.message) this.message = data.message;
    if (data?.buttonText) this.buttonText = data.buttonText;
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
