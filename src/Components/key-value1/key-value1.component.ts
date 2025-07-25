import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { KVS_Service } from 'src/KVS_service';
import { KeyValueStoreWebService } from 'src/WebServices/KeyValueStoreWebService';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { KeyValues } from 'src/models/KeyValues';
import { KeyValueFormComponent } from '../key-value-form/key-value-form.component';
import { FormsModule } from '@angular/forms'; // Import the FormsModule
import { NotificationService } from 'src/Services/notification.service';
import { KeyValuesOneLang } from 'src/models/KeyValuesOneLang';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-key-value1',
  templateUrl: './key-value1.component.html',
  styleUrls: ['./key-value1.component.scss'],
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
  ],
})
export class KeyValue1Component implements OnInit {
  id!: number;
  displayedColumns: string[] = ['key', 'value', 'delete'];
  KeyValues: KeyValuesOneLang[] = [];
  dataSource: any;
  title!: string;

  constructor(
    private route: ActivatedRoute,
    private API_Service: KVS_Service,
    public dialogService: MatDialog,
    public router: Router,
    public notifyService: NotificationService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = +params['id']; // The '+' sign is used to convert the parameter to a number
      this.getDataSet(this.id);
      this.fetchKeyValues();
      window.scrollTo(0, 0);
    });
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  getDataSet(id: number) {
    var parameters = '_dataSet=' + id;
    var request = {
      service: KeyValueStoreWebService.service,
      extension: KeyValueStoreWebService.qryDatasets,
      parameters: parameters,
    };
    this.API_Service.getRequest(request)
      .then((data) => {
        if (data != null) {
          if (data.list[0] != null) {
            this.title = data.list[0].name + " ( "+id+ " )";
          }
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
  fetchKeyValues() {
    const parameters = `_dataSet=${this.id}&_language=1`;
    const request = {
      service: KeyValueStoreWebService.service,
      extension: KeyValueStoreWebService.qryKVS,
      parameters: parameters,
    };
    this.API_Service.getRequest(request)
      .then((data) => {
        if (data != null) {
          this.KeyValues = data.list;
          this.KeyValues.forEach((item) => {
            item.editedValue = item.value;
          });
          this.dataSource = new MatTableDataSource<KeyValuesOneLang>(
            this.KeyValues
          );
          this.dataSource.paginator = this.paginator;
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
  openAddDialog() {
    const dialogRef = this.dialogService.open(KeyValueFormComponent, {
      data: { dataset: this.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined && result === 1) {
        // After dialog is closed we're refreshing the grid
        // For add we're just pushing a new row inside DataService
        this.fetchKeyValues();
      }
    });
  }
  saveRow(row: any) {
    if (row.value !== row.editedValue) {
      const oldEditedValue = row.value;
      var kvs = new KeyValues(this.id, 1, row.key, row.editedValue);
      var request = {
        service: KeyValueStoreWebService.service,
        extension: KeyValueStoreWebService.setKVS,
      };
      this.API_Service.postRequest(request, kvs)
        .then((data) => {
          if (data != null) {
            this.notifyService.showSuccess(
              'Record Saved Successfully',
              'Success'
            );
            row.value = row.editedValue;
          } else {
            //return old value in the field
            row.editedValue = oldEditedValue;
          }
        })
        .catch((error) => {
          row.editedValue = oldEditedValue;
          this.dialogService.open(AlertDialogComponent, {
            data: {
              title: error.status + ' ' + error.name,
              message: error.error.error,
            },
          });
          row.editedValue = oldEditedValue;
        });
    }
  }
  applyFilter(filterValue: string) {
    if (filterValue) {
      // Apply the filter logic using the filterValue
      this.dataSource.filter = filterValue.trim().toLowerCase();
    } else {
      // Reset the filter
      this.dataSource.filter = '';
    }
  }

  deleteRow(row: any) {
    var kvs = new KeyValues(this.id, 1, row.key, row.editedValue);
    var request = {
      service: KeyValueStoreWebService.service,
      extension: KeyValueStoreWebService.delKVS,
    };
    this.API_Service.postRequest(request, kvs)
      .then((data) => {
        if (data != null) {
          this.notifyService.showSuccess(
            'Record Deleted Successfully',
            'Success'
          );

          this.fetchKeyValues();
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
        // Handle the "YES" action
        console.log('User clicked YES');
        this.deleteRow(element);
        // Perform your action here
      } else {
        // Handle the "NO" action or dialog closure
        console.log('User clicked NO or closed the dialog');
      }
    });
  }
}
