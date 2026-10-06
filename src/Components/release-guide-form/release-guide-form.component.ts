import { Component, Inject, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent
} from '@angular/material/autocomplete';

import { KVS_Service } from 'src/KVS_service';
import { KeyValueStoreWebService } from 'src/WebServices/KeyValueStoreWebService';
import { NotificationService } from 'src/Services/notification.service';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';


import { ReleaseGuide } from 'src/models/ReleaseGuide';

import { Observable, from, startWith } from 'rxjs';


@Component({
  selector: 'app-release-guide-form',
  templateUrl: './release-guide-form.component.html',
  styleUrls: ['./release-guide-form.component.scss'],
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    FormsModule,
    ReactiveFormsModule,

    MatDialogModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule
  ]
})
export class ReleaseGuideFormComponent implements OnInit {

  form!: FormGroup;

  module = new FormControl('', Validators.required);
  filteredModules: any[] = [];
  modules: any[] = [];

  mod: any;
  selectedName = '';


  constructor(
    private fb: FormBuilder,
    private API_Service: KVS_Service,
    private dialogRef: MatDialogRef<ReleaseGuideFormComponent>,

    @Inject(MAT_DIALOG_DATA)
    public data: {
      mode: 'add' | 'edit';
      release: string;
      releaseGuide?: ReleaseGuide;
    },
    public dialogService: MatDialog,
    public notifyService: NotificationService
  ) {}


  ngOnInit(): void {

    this.form = this.fb.group({
      release: [this.data.release, Validators.required],
      moduleId: [this.data.releaseGuide?.moduleId || null, Validators.required],
      subject: [this.data.releaseGuide?.subject || '', Validators.required],
      guide: [this.data.releaseGuide?.guide || '', Validators.required]
    });

    this.fetchModules().subscribe(() => {

      this.filteredModules = this.modules;

      if (this.data.releaseGuide) {

        const selectedModule = this.modules.find(
          (m) => Number(m.key) === Number(this.data.releaseGuide?.moduleId)
        );

        if (selectedModule) {
          this.selectedName = selectedModule.value;
          this.mod = selectedModule.key;
          this.module.setValue(selectedModule.value);
        }
      }

      this.module.valueChanges
        .pipe(startWith(this.module.value))
        .subscribe((value) => {

          this.filteredModules = this.filterModules(value);

          if (typeof value === 'string' && value !== this.selectedName) {
            this.form.get('moduleId')?.setValue(null);
          }
        });
    });
  }

  onModuleFocus(): void {
    this.filteredModules = this.modules;
  }


  filterModules(value: any): any[] {

    const filterValue = (value || '').toString().toLowerCase();

    return this.modules.filter(
      (m) =>
        m.value.toString().toLowerCase().includes(filterValue) ||
        m.key.toString().toLowerCase().includes(filterValue)
    );
  }

  fetchModules(): Observable<any> {

    const request = {
      service: KeyValueStoreWebService.service,
      extension: KeyValueStoreWebService.qryKVS,
      parameters: '_dataset=1&_language=1'
    };

    return from(
      new Promise((resolve) => {

        this.API_Service.getRequest(request)
          .then((data) => {

            if (data != null) {
              this.modules = data.list;
              resolve(data.list);
            } else {
              resolve(null);
            }
          })
          .catch((error) => {
            console.error('Error loading modules', error);
            resolve(null);
          });
      })
    );
  }


  onModuleSelected(event: MatAutocompleteSelectedEvent): void {

    const key = event.option.value;
    const selected = this.modules.find((m) => m.key === key);

    if (selected) {
      this.selectedName = selected.value;   // set BEFORE setValue
      this.mod = key;
      this.module.setValue(selected.value);
      this.form.get('moduleId')?.setValue(Number(key));
    }
  }


  getErrorMessage(field: string): string {

    const control = this.form.controls[field];

    if (control?.hasError('required')) {
      return `${field} is required`;
    }

    return '';
  }

  private saveReleaseGuide(formValue: any): void {

    const request = {
      service: KeyValueStoreWebService.service,
      extension: KeyValueStoreWebService.setReleaseGuide,
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


  submit(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const releaseGuide: ReleaseGuide = {
      release: this.form.get('release')?.value,
      moduleId: Number(this.form.get('moduleId')?.value),
      seqNo: this.data.releaseGuide?.seqNo || 0,
      subject: this.form.get('subject')?.value,
      guide: this.form.get('guide')?.value
    };

    this.saveReleaseGuide(releaseGuide);
          
    this.dialogRef.close(releaseGuide);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}