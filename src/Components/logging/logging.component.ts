import { Component, OnInit, ViewChild } from '@angular/core';
import { KVS_Service } from '../../KVS_service';
import { KeyValueStoreWebService } from 'src/WebServices/KeyValueStoreWebService';
import { RequestsWebService } from 'src/WebServices/RequestsWebService';
import { IdentityServerService } from 'src/WebServices/IdentityServerService';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { KeyValues } from 'src/models/KeyValues';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from 'src/Services/notification.service';
import { MA_Service } from 'src/MA_service';
import { Accounts } from 'src/models/Accounts';
import { Requests } from 'src/models/Requests';

@Component({
  selector: 'app-logging',
  templateUrl: './logging.component.html',
  styleUrls: ['./logging.component.scss'],
})
export class LoggingComponent implements OnInit {
  accounts: Accounts[] = [];
  eventTypes: KeyValues[] = [];
  baseUrls: KeyValues[] = [];
  requests: Requests[] = [];
  dataSource: any;
  form: FormGroup;
  filterValue = '';

  displayedColumns: string[] = [
    'accountId',
    'userId',
    'recordId',
    'clockStamp',
    'token',
    'url',
    'requestBody',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private API_Service: KVS_Service,
    private MA_API_Service: MA_Service,
    private formBuilder: FormBuilder,
    public dialogService: MatDialog,
    public notifyService: NotificationService
  ) {
    this.form = this.formBuilder.group({
      baseUrl: '',
      accountId: '',
      eventType: '',
      userId: '',
      contains: '',
      recordId: 0,
    });
  }
  setDefaultRecordId() {
    const recordIdControl = this.form.get('recordId');
    if (recordIdControl && !recordIdControl.value) {
      recordIdControl.setValue(0);
    }
  }
  formatDate(dateStr: string): string {
    const timestamp = this.extractTimestamp(dateStr);
    const date = new Date(timestamp);
    return this.formatDateAsDDMMYYYY(date);
  }

  extractTimestamp(dateStr: string | null): number {
    if (dateStr) {
      const matchResult = dateStr.match(/\d+/);
      if (matchResult) {
        return parseInt(matchResult[0]);
      }
    }
    // Default return value if no match is found
    return 0;
  }

  formatDateAsDDMMYYYY(date: Date): string {
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();
    return `${this.padNumber(day)}/${this.padNumber(
      month
    )}/${year} ${this.padNumber(hours)}:${this.padNumber(
      minutes
    )}:${this.padNumber(seconds)}`;
  }

  padNumber(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  onRefreshClick() {
    const formData = this.extractFormData();
    this.onSelectionChange(formData);
  }

  extractFormData() {
    return this.form.value;
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.fetchAccounts();
    this.fetchErrorType();
    this.fetchBaseUrls();
  }

  // applyFilter() {
  //   const filterControl = this.form.get('filterValue');
  //   if (filterControl && filterControl.value) {
  //     const filterValue = filterControl.value;
  //     // Apply the filter logic using the filterValue
  //     this.dataSource.filter = filterValue.trim().toLowerCase();
  //   } else {
  //     this.dataSource.filter = '';
  //   }
  // }

  fetchAccounts() {
    var request = {
      service: IdentityServerService.service,
      extension: IdentityServerService.qryAC,
      parameters: '',
    };
    this.MA_API_Service.qryAC(request)
      .then((data) => {
        if (data != null) {
          this.accounts = data.list;
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

  fetchErrorType() {
    var parameters = '_dataSet=159&_language=1';
    var request = {
      service: KeyValueStoreWebService.service,
      extension: KeyValueStoreWebService.qryKVS,
      parameters: parameters,
    };
    this.API_Service.getRequest(request)
      .then((data) => {
        if (data != null) {
          this.eventTypes = data.list;
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

  fetchBaseUrls() {
    var parameters = '_dataSet=174&_language=1';
    var request = {
      service: KeyValueStoreWebService.service,
      extension: KeyValueStoreWebService.qryKVS,
      parameters: parameters,
    };
    this.API_Service.getRequest(request)
      .then((data) => {
        if (data != null) {
          this.baseUrls = data.list;
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

  onSelectionChange(event: any) {
    this.setDefaultRecordId();
    const formValues = this.form.value;
    if (
      formValues.accountId != '' &&
      formValues.eventType != '' &&
      formValues.baseUrl != '' &&
      formValues.userId != ''
    ) {
      var request = {
        baseUrl: formValues.baseUrl,
        service: RequestsWebService.service,
        extension: RequestsWebService.qryREQ,
        parameters: `_accountId=${formValues.accountId}&_eventType=${formValues.eventType}&_userId=${formValues.userId}&_recordId=${formValues.recordId}&_contains=${formValues.contains}&_from=&_to=&
        `,
      };
      this.API_Service.getRequest(request)
        .then((data) => {
          if (data != null) {
            this.requests = data.list;
            this.dataSource = new MatTableDataSource<Requests>(data.list);
            this.dataSource.paginator = this.paginator;

            //this.applyFilter();
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
  }
}
