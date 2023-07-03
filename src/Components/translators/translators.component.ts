import { Component, OnInit } from '@angular/core';
import { KVS_Service } from '../../KVS_service';
import { Languages } from 'src/models/Languages';
import { KeyValueStoreWebService } from 'src/WebServices/KeyValueStoreWebService';
import { Datasets } from 'src/models/Datasets';

@Component({
  selector: 'app-translators',
  templateUrl: './translators.component.html',
  styleUrls: ['./translators.component.scss'],
})
export class TranslatorsComponent implements OnInit {
  languages: Languages[] = [];
  dataSets: Datasets[] = [];
  fromLanguageId: any;
  toLanguageId: any;
  dataset: any;
  isDropdownOpen :any;
  isEditable :any;

  constructor(private API_Service: KVS_Service) {}

  ngOnInit() {
    this.fetchLanguages();
    this.fetchDataSets();
    
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
        this.fromLanguageId = this.languages[0].languageId;
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
}
