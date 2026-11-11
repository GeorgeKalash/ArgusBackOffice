import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { KVS_Service } from 'src/KVS_service';
import { KeyValueStoreWebService } from 'src/WebServices/KeyValueStoreWebService';

import { ReleaseGuide } from 'src/models/ReleaseGuide';
import { ReleaseGuideFormComponent } from '../release-guide-form/release-guide-form.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { NotificationService } from 'src/Services/notification.service';
import * as Papa from 'papaparse';

@Component({
  selector: 'app-release-guide',
  templateUrl: './release-guide.component.html',
  styleUrls: ['./release-guide.component.scss'],
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    FlexLayoutModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
  ]
})
export class ReleaseGuideComponent implements OnInit {

  release: string = '';

  releaseGuides: ReleaseGuide[] = [];

  dataSource = new MatTableDataSource<ReleaseGuide>([]);

  displayedColumns: string[] = [
    'module',
    'subject',
    'guide',
    'edit',
    'delete'
  ];

  modules: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('inputRef') inputRef!: ElementRef<HTMLInputElement>;

  constructor(
    private route: ActivatedRoute,
    private API_Service: KVS_Service,
    private dialog: MatDialog,
    public dialogService: MatDialog,
    public notifyService: NotificationService
  ) {}


  ngOnInit(): void {

    this.release = this.route.snapshot.paramMap.get('id') || '';

    this.fetchModules();
    this.fetchReleaseGuides();
  }

  fetchModules(): void {

    const request = {
      service: KeyValueStoreWebService.service,
      extension: KeyValueStoreWebService.qryKVS,
      parameters: '_dataset=1&_language=1'
    };

    this.API_Service.getRequest(request)
      .then((data) => {
        if (data != null) {
          this.modules = data.list;
        }
      })
      .catch((error) => {
        console.error('Error loading modules', error);
      });
  }

  importCsv(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (!this.release) {
      this.notifyService.showError('Release is not defined in the URL', 'Error');
      input.value = '';
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) =>
        header.replace(/^\uFEFF/, '').trim().toLowerCase(),

      complete: (result) => {
        const requiredColumns = ['moduleref', 'subject', 'guide'];
        const headers = result.meta.fields || [];

        const missingColumns = requiredColumns.filter(
          column => !headers.includes(column)
        );

        if (missingColumns.length > 0) {
          alert(`Missing CSV columns: ${missingColumns.join(', ')}`);
          input.value = '';
          return;
        }

        const rows = (result.data as any[]).map((row, index) => ({
          rowNumber: index + 2,
          moduleRef: row.moduleref?.trim(),
          subject: row.subject?.trim(),
          guide: row.guide?.trim()
        }));

        const invalidRows = rows.filter(
          item => !item.moduleRef || !item.subject || !item.guide
        );

        if (invalidRows.length > 0) {
          alert(`Invalid rows (missing values): ${invalidRows.map(x => x.rowNumber).join(', ')}`);
          input.value = '';
          return;
        }

        if (rows.length === 0) {
          alert('The CSV file contains no data rows.');
          input.value = '';
          return;
        }

        const body = {
          release: this.release,
          items: rows.map(({ rowNumber, ...item }) => item)
        };

        const request = {
          service: KeyValueStoreWebService.service,
          extension: KeyValueStoreWebService.batchReleaseGuide
        };

        this.API_Service.postRequest(request, body)
          .then((data) => {
            if (data != null) {
              this.notifyService.showSuccess(
                `${body.items.length} release guides imported successfully`,
                'Success'
              );
              this.fetchReleaseGuides();
            }
          })
          .catch((error) => {
            this.dialogService.open(AlertDialogComponent, {
              data: {
                title: error.status + ' ' + error.name,
                message: error.error?.error || 'Import failed',
              },
            });
          })
          .finally(() => {
            input.value = '';
          });
      },

      error: (error) => {
        console.error('CSV parsing error:', error);
        alert('Error reading CSV file.');
        input.value = '';
      }
    });
  }

  getModuleName(moduleId: number): string {

    const module = this.modules.find(
      x => Number(x.key) === Number(moduleId)
    );

    return module ? module.value : '';
  }

  addReleaseGuide(): void {

    const dialogRef = this.dialog.open(ReleaseGuideFormComponent, {
      width: '600px',
      data: {
        mode: 'add',
        release: this.release
      }
    });

    dialogRef.afterClosed().subscribe(async (result: ReleaseGuide | undefined) => {

      if (!result) return;   

      this.fetchReleaseGuides();
    });
  }


  editReleaseGuide(row: ReleaseGuide): void {

    const dialogRef = this.dialog.open(ReleaseGuideFormComponent, {
      width: '600px',
      data: {
        mode: 'edit',
        release: row.release,
        releaseGuide: row
      }
    });

    dialogRef.afterClosed().subscribe(async (result) => {

      if (result === 1) this.fetchReleaseGuides();
    });
  }

  fetchReleaseGuides(): void {

    const request = {
      service: KeyValueStoreWebService.service,
      extension: KeyValueStoreWebService.qryReleaseGuide,
      parameters: '_release=' + this.release
    };

    this.API_Service.getRequest(request)
      .then((data) => {

        if (data != null) {

          this.releaseGuides = data.list || [];

          this.dataSource = new MatTableDataSource<ReleaseGuide>(
            this.releaseGuides
          );

          this.dataSource.paginator = this.paginator;
          const inputValue = this.inputRef.nativeElement.value;
          this.applyFilter(inputValue);
        }
      })
      .catch((error) => {
        console.error('Error loading release guides', error);
      });
  }

  applyFilter(filterValue: string) {
    if (filterValue) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    } else {
      this.dataSource.filter = '';
    }
  }

  public deleteRow(element: any): void {
      var request = {
        service: KeyValueStoreWebService.service,
        extension: KeyValueStoreWebService.delReleaseGuide,
      };
      this.API_Service.postRequest(request, element)
        .then((data) => {
          if (data != null) {
            this.notifyService.showSuccess(
              'Record Deleted Successfully',
              'Success'
            );
  
            this.fetchReleaseGuides();
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
  
    openConfirmationDialog(element: any): void {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '250px', // Set the dialog's width as needed
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result === true) {
          this.deleteRow(element);
          // Perform your action here
        }
      });
    }
  
    deleteItem(event: Event, element: any) {
      event.stopPropagation(); // Stop event propagation
      this.openConfirmationDialog(element);
    }

}