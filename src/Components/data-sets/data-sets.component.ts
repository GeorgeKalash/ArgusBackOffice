import { AfterViewInit, Component, ViewChild } from '@angular/core';
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
  displayedColumns: string[] = ['datasetId', 'name'];
  dataSets: Datasets[] = [];
  dataSource: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private API_Service: KVS_Service,
    public dialogService: MatDialog,
    public router: Router
  ) {}
  ngAfterViewInit() {
    this.fetchDataSets();

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
}
