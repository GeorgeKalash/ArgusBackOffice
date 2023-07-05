import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { KVS_Service } from 'src/KVS_service';
import { KeyValueStoreWebService } from 'src/WebServices/KeyValueStoreWebService';
import { Datasets } from 'src/models/Datasets';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
  selector: 'app-data-sets',
  templateUrl: './data-sets.component.html',
  styleUrls: ['./data-sets.component.scss'],  
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, FlexLayoutModule],
})
export class DataSetsComponent implements AfterViewInit {
  displayedColumns: string[] = ['datasetId', 'name'];
  dataSets: Datasets[] = [];
  dataSource : any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private API_Service: KVS_Service){

  }
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
        this.dataSets = data.list;
        this.dataSource = new MatTableDataSource<Datasets>(this.dataSets);
        this.dataSource.paginator = this.paginator;
      })
      .catch((error) => {
        console.error('Error fetching datasets:', error);
      });
  }

}
