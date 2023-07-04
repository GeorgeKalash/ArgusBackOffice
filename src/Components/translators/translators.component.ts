import { Component, OnInit } from '@angular/core';
import { KVS_Service } from '../../KVS_service';
import { Languages } from 'src/models/Languages';
import { KeyValueStoreWebService } from 'src/WebServices/KeyValueStoreWebService';
import { Datasets } from 'src/models/Datasets';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { KeyValues } from 'src/models/KeyValues';
import { KeyValuesTable } from 'src/models/KeyValuesTable';

@Component({
  selector: 'app-translators',
  templateUrl: './translators.component.html',
  styleUrls: ['./translators.component.scss'],
})
export class TranslatorsComponent implements OnInit {
  languages: Languages[] = [];
  dataSets: Datasets[] = [];
  joinedArray: any[] = [];
  fromLanguageId: any;
  toLanguageId: any;
  dataset: any;
  isDropdownOpen: any;
  isEditable: any;
  form: FormGroup;

  KVS1: KeyValues[] = [];
  KVS2: KeyValues[] = [];
  displayedColumns: string[] = ['key', 'value1', 'value2'];

  constructor(
    private API_Service: KVS_Service,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      dataset: '',
      disabledFromLanguageId: new FormControl({ value: 1, disabled: true }),
      fromLanguageId: new FormControl({ value: 1, disabled: false }),
      toLanguageId: '',
    });
  }

  ngOnInit() {
    this.fetchLanguages();
    this.fetchDataSets();
    //this.form.get('fromLanguageId')?.disable();
  }

  fetchLanguages() {
    var request = {
      service: KeyValueStoreWebService.service,
      extension: KeyValueStoreWebService.qryLanguages,
      parameters: '',
    };
    this.API_Service.getRequest(request)
      .then((data) => {
        this.languages = data.list;
        //this.fromLanguageId = this.languages[0].languageId;
      })
      .catch((error) => {
        console.error('Error fetching languages:', error);
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
        this.dataSets = data.list;
      })
      .catch((error) => {
        console.error('Error fetching datasets:', error);
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
        return data.list;
      })
      .catch((error) => {
        console.error('Error fetching KVS:', error);
        return [];
      });
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
          console.error('Error fetching KVS:', error);
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
          console.error('Error fetching KVS:', error);
          this.KVS2 = [];
        });
      Promise.all([request1, request2])
        .then(([array1, array2]) => {
          // Joining arrays based on key value
          this.joinedArray = this.KVS1.map((item) => {
            const matchingItem = this.KVS2.find(
              (element) => element.key === item.key
            );
            if (matchingItem) {
              return {
                key: item.key,
                value1: item.value,
                value2: matchingItem.value,
              };
            }
            return item;
          });
          //joinedArray is my table's data
        })
        .catch((error) => {
          console.error('Error fetching KVS:', error);
        });
    }
  }
}
