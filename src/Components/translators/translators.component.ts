import { Component, OnInit, ViewChild } from '@angular/core';
import { KVS_Service } from '../../KVS_service';
import { Languages } from 'src/models/Languages';
import { KeyValueStoreWebService } from 'src/WebServices/KeyValueStoreWebService';
import { Datasets } from 'src/models/Datasets';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { KeyValues } from 'src/models/KeyValues';
import { KeyValuesTable } from 'src/models/KeyValuesTable';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from 'src/Services/notification.service';
import { startWith } from 'rxjs';

@Component({
  selector: 'app-translators',
  templateUrl: './translators.component.html',
  styleUrls: ['./translators.component.scss'],
})
export class TranslatorsComponent implements OnInit {
  languages: Languages[] = [];
  toLanguages: Languages[] = [];
  dataSets: Datasets[] = [];
  joinedArray: any[] = [];
  dataSource: any;
  fromLanguageId: any;
  toLanguageId: any;
  //dataset: any;
  isDropdownOpen: any;
  isEditable: any;
  form: FormGroup;
  filterValue = '';

  KVS1: KeyValues[] = [];
  KVS2: KeyValues[] = [];
  displayedColumns: string[] = ['key', 'value1', 'value2'];
  filteredDataSets: any[] = []; // filtered datasets based on search
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
      disabledFromLanguageId: new FormControl({ value: 1, disabled: true }),
      fromLanguageId: new FormControl({ value: 1, disabled: false }),
      toLanguageId: '',
      filterValue: new FormControl(),
    });
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.fetchLanguages();
    this.fetchDataSets();
    this.filteredDataSets = this.dataSets;
    this.dataset.valueChanges
      .pipe(startWith('')) // start with an empty string
      .subscribe((value) => {
        this.filteredDataSets = this.filterDataSets(value);
      });
  }

  applyFilter() {
    const filterControl = this.form.get('filterValue');
    if (filterControl && filterControl.value) {
      const filterValue = filterControl.value;
      // Apply the filter logic using the filterValue
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    else{
      this.dataSource.filter = '';
    }
  }

  filterDataSets(value: string): any[] {
    // filter the datasets based on the search value
    const filterValue = value.toString().toLowerCase();
    return this.dataSets.filter((sets) =>
      sets.name.toString().toLowerCase().includes(filterValue)
    );
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
          this.toLanguages = data.list.filter(
            (item: Languages) => item.languageId != 1
          );
          //this.fromLanguageId = this.languages[0].languageId;
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

  onSelectionChangeDataSet(event: any) {
    const selectedDataSetId = event.option.value;
    this.form.controls['dataset'].setValue(selectedDataSetId);

    const selectedDataSet = this.dataSets.find(
      (sets) => sets.datasetId === selectedDataSetId
    );
    if (selectedDataSet) {
      this.dataset.setValue(selectedDataSet.name);
    }
    this.onSelectionChange(event);
  }
  onSelectionChange(event: any) {
    const formValues = this.form.value;

    if (
      formValues.dataset != '' &&
      formValues.fromLanguageId != '' &&
      formValues.toLanguageId != ''
    ) {
      //KVS.asmx.getKVS(_dataSet, fromLanguageId)
      const request1 = this.fetchKVS(
        formValues.dataset,
        formValues.fromLanguageId
      )
        .then((kvs: KeyValues[]) => {
          this.KVS1 = kvs;
        })
        .catch((error) => {
          this.dialogService.open(AlertDialogComponent, {
            data: {
              title: error.status + ' ' + error.name,
              message: error.error.error,
            },
          });
          this.KVS1 = [];
        });

      //KVS.asmx.getKVS(_dataSet, toLanguageId)
      const request2 = this.fetchKVS(
        formValues.dataset,
        formValues.toLanguageId
      )
        .then((kvs: KeyValues[]) => {
          this.KVS2 = kvs;
        })
        .catch((error) => {
          this.dialogService.open(AlertDialogComponent, {
            data: {
              title: error.status + ' ' + error.name,
              message: error.error.error,
            },
          });
          this.KVS2 = [];
        });
      Promise.all([request1, request2])
        .then(([array1, array2]) => {
          // Joining arrays based on key value
          this.joinedArray = this.KVS1.map((item) => {
            const matchingItem = this.KVS2.find(
              (element) => element.key === item.key
            );
            //if (matchingItem) {
              return {
                dataSet: item.dataset,
                key: item.key,
                language: matchingItem == undefined ? formValues.toLanguageId :matchingItem.language,
                value1: item.value,
                value2: matchingItem == undefined ? null : matchingItem.value,
                editedValue2: matchingItem == undefined ? null : matchingItem.value,
              };
            //}
            return item;
          });

          this.dataSource = new MatTableDataSource<Datasets>(this.joinedArray);
          this.dataSource.paginator = this.paginator;
          //joinedArray is my table's data
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

  saveRow(row: any) {
    if (row.value2 !== row.editedValue2) {
      const oldEditedValue2 = row.value2;
      var kvs = new KeyValues(
        row.dataSet,
        row.language,
        row.key,
        row.editedValue2
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
            row.value2 = row.editedValue2;
          } else {
            //return old value in the field
            row.editedValue2 = oldEditedValue2;
          }
        })
        .catch((error) => {
          this.dialogService.open(AlertDialogComponent, {
            data: {
              title: error.status + ' ' + error.name,
              message: error.error.error,
            },
          });
          row.editedValue2 = oldEditedValue2;
        });
    }
  }
}
