import { Component, OnInit, ViewChild } from '@angular/core';
import { KVS_Service } from '../../KVS_service';
import { Languages } from 'src/models/Languages';
import { KeyValueStoreWebService } from 'src/WebServices/KeyValueStoreWebService';
import { Datasets } from 'src/models/Datasets';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { KeyValues } from 'src/models/KeyValues';
import { KeyValuesTable } from 'src/models/KeyValuesTable';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from 'src/Services/notification.service';
import { startWith } from 'rxjs';

@Component({
  selector: 'app-keyvalues',
  templateUrl: './keyvalues.component.html',
  styleUrls: ['./keyvalues.component.scss'],
})
export class KeyValuesComponent implements OnInit {
  languages: Languages[] = [];
  toLanguages: Languages[] = [];
  dataSets: Datasets[] = [];
  dataArray: any[] = [];
  dataSource: any;
  toLanguageId: any;
  form: FormGroup;
  filterValue = '';
  displayedColumns: string[] = ['dataset', 'key', 'value'];
  dataset = new FormControl();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private API_Service: KVS_Service,
    private formBuilder: FormBuilder,
    public dialogService: MatDialog,
    public notifyService: NotificationService
  ) {
    this.form = this.formBuilder.group({
      dataset: ['', Validators.required],
      toLanguageId: '',
      filterValue: new FormControl(),
    });
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.fetchLanguages();
    this.fetchData("0");
  }

  applyFilter() {
    const filterControl = this.form.get('filterValue');
    if (filterControl && filterControl.value) {
      const filterValue = filterControl.value;
      // Apply the filter logic using the filterValue
      this.dataSource.filter = filterValue.trim().toLowerCase();
    } else {
      this.dataSource.filter = '';
    }
  }

  fetchLanguages() {
    var request = {
      service: KeyValueStoreWebService.service,
      extension: KeyValueStoreWebService.qryLanguages,
      parameters: '',
    };
    this.API_Service.getRequest(request)
      .then((data) => {
        if (data != null) {
          this.languages = data.list;
          this.toLanguages = data.list;
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

  fetchKVS(_dataSet: any, _languageId: any): Promise<KeyValues[]> {
    const parameters = `_dataSet=${_dataSet}&_language=${_languageId}`;
    const request = {
      service: KeyValueStoreWebService.service,
      extension: KeyValueStoreWebService.qryKVS,
      parameters: parameters,
    };

    return this.API_Service.getRequest(request)
      .then((data) => {
        if (data != null) {
          return data.list;
        }
      })
      .catch((error) => {
        this.dialogService.open(AlertDialogComponent, {
          data: {
            title: error.status + ' ' + error.name,
            message: error.error.error,
          },
        });
        return [];
      });
  }

  fetchData(languageId: any) {
    this.fetchKVS(0, languageId)
    .then((kvs: KeyValues[]) => {
      this.dataArray = kvs.map((item) => {
        return {
          dataset: item.dataset,
          key: item.key,
          language: item.language,
          value: item.value,
          editedValue: item.value,
        };
      });
      this.dataSource = new MatTableDataSource<KeyValues>(this.dataArray);
      this.dataSource.paginator = this.paginator;

      this.applyFilter();
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
    onSelectionChange(event: any) {
    const formValues = this.form.value;

    if (formValues.toLanguageId != '') {
      this.fetchData(formValues.toLanguageId)
    }
  }
  

  saveRow(row: any) {
    if (row.value !== row.editedValue) {
      const oldEditedValue = row.value;
      var kvs = new KeyValues(
        row.dataset,
        row.language,
        row.key,
        row.editedValue
      );
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
}
