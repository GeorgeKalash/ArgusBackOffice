import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { KVS_Service } from 'src/KVS_service';
import { KeyValueStoreWebService } from 'src/WebServices/KeyValueStoreWebService';
import { Datasets } from 'src/models/Datasets';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDialog } from '@angular/material/dialog';
import { DataSetsFormComponent } from '../data-sets-form/data-sets-form.component';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { NotificationService } from 'src/Services/notification.service';

@Component({
  selector: 'app-data-sets',
  templateUrl: './data-sets.component.html',
  styleUrls: ['./data-sets.component.scss'],
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    FlexLayoutModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class DataSetsComponent implements AfterViewInit {
  displayedColumns: string[] = ['datasetId', 'name', 'delete'];
  dataSets: Datasets[] = [];
  dataSource: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('inputRef') inputRef!: ElementRef<HTMLInputElement>;

  constructor(
    private API_Service: KVS_Service,
    public dialogService: MatDialog,
    public router: Router,
    public dialog: MatDialog,
    public notifyService: NotificationService
  ) {}
  ngAfterViewInit() {
    this.fetchDataSets();
    window.scrollTo(0, 0);
    //this.dataSource.paginator = this.paginator;
  }
  fetchDataSets() {
    var parameters = '_dataSet=0';
    var request = {
      service: KeyValueStoreWebService.service,
      extension: KeyValueStoreWebService.qryDatasets,
      parameters: parameters,
    };
    this.API_Service.getRequest(request)
      .then((data) => {
        if (data != null) {
          this.dataSets = data.list;
          this.dataSource = new MatTableDataSource<Datasets>(this.dataSets);
          this.dataSource.paginator = this.paginator;
          const inputValue = this.inputRef.nativeElement.value;
          this.applyFilter(inputValue);
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
    const dialogRef = this.dialogService.open(DataSetsFormComponent, {
      data: { dataSet: {} },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined && result === 1) {
        // After dialog is closed we're refreshing the grid
        // For add we're just pushing a new row inside DataService
        this.fetchDataSets();
      }
    });
  }
  startEdit(row: Datasets) {
    this.router.navigate(['/kvs/' + row.datasetId]);
  }
  
  applyFilter(filterValue: string) {
    if (filterValue) {
      // Apply the filter logic using the filterValue
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    else{
      // Reset the filter
      this.dataSource.filter = '';
    }
  }

  public deleteRow(element:any): void {
    var request = {
      service: KeyValueStoreWebService.service,
      extension: KeyValueStoreWebService.delDataset,
    };
    this.API_Service.postRequest(request, element)
      .then((data) => {
        if (data != null) {
          this.notifyService.showSuccess(
            'Record Deleted Successfully',
            'Success'
          );

          this.fetchDataSets();
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
