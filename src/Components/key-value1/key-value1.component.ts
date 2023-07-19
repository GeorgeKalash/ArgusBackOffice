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
  ],
})
export class KeyValue1Component implements OnInit {
  id!: number;

  constructor(
    private route: ActivatedRoute,
    private API_Service: KVS_Service,
    public dialogService: MatDialog,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params['id'] == null || params['id'] == undefined)
        this.router.navigate(['/dataSets']);
      else {
        this.id = +params['id']; // The '+' sign is used to convert the parameter to a number
        this.fetchKeyValues();
      }
      // You can now use 'this.id' in your component to access the id value.
    });
  }
  displayedColumns: string[] = ['key', 'value', 'actions'];
  KeyValues: KeyValues[] = [];
  dataSource: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

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
          console.log(data.list);
          this.dataSource = new MatTableDataSource<KeyValues>(this.KeyValues);
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
      data: { dataSet: {} },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result != undefined && result === 1) {
        // After dialog is closed we're refreshing the grid
        // For add we're just pushing a new row inside DataService
        this.fetchKeyValues();
      }
    });
  }
}
