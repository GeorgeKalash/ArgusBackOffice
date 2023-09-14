import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { KVS_Service } from 'src/KVS_service';
import { NotificationService } from 'src/Services/notification.service';
import { KeyValueStoreWebService } from 'src/WebServices/KeyValueStoreWebService';
import { KeyValues } from 'src/models/KeyValues';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { Observable, from, startWith } from 'rxjs';
import { ReportTemplateFormComponent } from '../report-template-form/report-template-form.component';
import { Attachment } from 'src/models/Attachment';
import { SystemWebService } from 'src/WebServices/SystemWebService';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-report-templates',
  templateUrl: './report-templates.component.html',
  styleUrls: ['./report-templates.component.scss'],
})
export class ReportTemplatesComponent {
  filteredResourceIds: any[] = []; // filtered resourceIds based on search
  resourceIds: KeyValues[] = [];
  resourceId = new FormControl();
  resId: any;

  filteredModules: any[] = []; // filtered modules based on search
  modules: KeyValues[] = [];
  module = new FormControl();
  mod: any;

  displayedColumns: string[] = ['layoutId', 'fileName', 'delete'];
  dataSource: any;

  constructor(
    private API_Service: KVS_Service,
    public dialogService: MatDialog,
    public notifyService: NotificationService
  ) {}

  ngOnInit() {
    window.scrollTo(0, 0);

    this.fetchModules().subscribe(() => {
      this.filteredResourceIds = this.resourceIds;
      this.resourceId.valueChanges
      .pipe(startWith('')) // start with an empty string
      .subscribe((value) => {
        this.filteredResourceIds = this.filterResourceIds(value);
        console.log(this.filteredResourceIds);
        });

      this.filteredModules = this.modules;
      this.module.valueChanges
        .pipe(startWith('')) // start with an empty string
        .subscribe((value) => {
          this.filteredModules = this.filterModules(value);
        });
    });
  }

  filterResourceIds(value: string): any[] {
    // filter the datasets based on the search value
    const filterValue = value.toString().toLowerCase();
    return this.resourceIds.filter((sets) =>
      sets.value.toString().toLowerCase().includes(filterValue)
    );
  }

  filterModules(value: string): any[] {
    // filter the datasets based on the search value
    const filterValue = value.toString().toLowerCase();
    return this.modules.filter((sets) =>
      sets.value.toString().toLowerCase().includes(filterValue)
    );
  }

  fetchModules(): Observable<any> {
    var parameters = '_dataset=1&_language=1';
    var request = {
      service: KeyValueStoreWebService.service,
      extension: KeyValueStoreWebService.qryKVS,
      parameters: parameters,
    };
    return from(
      // Your asynchronous operation here (e.g., an HTTP request)
      // Replace the setTimeout with your actual asynchronous operation
      new Promise((resolve) => {
        this.API_Service.getRequest(request)
          .then((data) => {
            if (data != null) {
              this.modules = data.list;
              resolve(data.list);
            } else {
              resolve(null);
            }
          })
          .catch((error) => {
            this.dialogService.open(AlertDialogComponent, {
              data: {
                title: error.status + ' ' + error.name,
                message: error.error.error,
              },
            });
            resolve(null);
          });
      })
    );
  }


  fetchResourceIds(module: any) {
    console.log("fetchResourceIds");
    var parameters = '_dataset=22&_language=1';
    var request = {
      service: KeyValueStoreWebService.service,
      extension: KeyValueStoreWebService.qryKVS,
      parameters: parameters,
    };
    this.API_Service.getRequest(request)
      .then((data: { list: KeyValues[] }) => {
        if (data != null) {
          this.resourceIds = data.list.filter((item) => Math.floor(item.key / 1000) === module);
          console.log(this.resourceIds);
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

  fetchAttachments(resourceId: any) {
    var parameters = '_resourceId=' + resourceId;
    var request = {
      service: KeyValueStoreWebService.service,
      extension: KeyValueStoreWebService.qryAttachment,
      parameters: parameters,
    };
    this.API_Service.getRequest(request)
      .then((data) => {
        if (data != null) {
          this.dataSource = new MatTableDataSource<Attachment>(data.list);
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
    const dialogRef = this.dialogService.open(ReportTemplateFormComponent, {
      data: { resourceId: this.resId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined && result === 1) {
        // After dialog is closed we're refreshing the grid
        this.fetchAttachments(this.resId);
      }
    });
  }

  applyFilter(filterValue: string) {
    if (filterValue) {
      // Apply the filter logic using the filterValue
      this.dataSource.filter = filterValue.trim().toLowerCase();
    } else {
      this.dataSource.filter = '';
    }
  }

  onSelectionChangeModule(event: any) {
    const selectedModule = event.option.value;
    this.module.setValue(selectedModule);
    this.mod = selectedModule;
    const selectedMod = this.modules.find((mod) => mod.key === selectedModule);
    if (selectedMod) {
      this.module.setValue(selectedMod.value);
      this.mod = selectedModule;
      this.fetchResourceIds(selectedModule);
    }
  }

  onSelectionChangeResourceId(event: any) {
    const selectedResourceId = event.option.value;
    this.resourceId.setValue(selectedResourceId);
    this.resId = selectedResourceId;
    const selectedResource = this.resourceIds.find(
      (resources) => resources.key === selectedResourceId
    );
    if (selectedResource) {
      this.resourceId.setValue(selectedResource.value);
      this.resId = selectedResourceId;
      this.fetchAttachments(selectedResourceId);
    }
  }

  
  openConfirmationDialog(element: any): void {
    const dialogRef = this.dialogService.open(ConfirmationDialogComponent, {
      width: '250px', // Set the dialog's width as needed
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        // Handle the "YES" action
        this.deleteRow(element);
        // Perform your action here
      } else {
        // Handle the "NO" action or dialog closure
      }
    });
  }

  deleteRow(row: any) {
    
    var request = {
      service: KeyValueStoreWebService.service,
      extension: KeyValueStoreWebService.delAttachment,
    };
    this.API_Service.postRequest(request, row)
      .then((data) => {
        if (data != null) {
          this.notifyService.showSuccess(
            'Record Deleted Successfully',
            'Success'
          );

          this.fetchAttachments(row.resourceId);
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
