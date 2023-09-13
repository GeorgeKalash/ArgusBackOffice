import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { KVS_Service } from 'src/KVS_service';
import { NotificationService } from 'src/Services/notification.service';
import { KeyValueStoreWebService } from 'src/WebServices/KeyValueStoreWebService';
import { KeyValues } from 'src/models/KeyValues';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { startWith } from 'rxjs';
import { ReportTemplateFormComponent } from '../report-template-form/report-template-form.component';
import { Attachment } from 'src/models/Attachment';

@Component({
  selector: 'app-report-templates',
  templateUrl: './report-templates.component.html',
  styleUrls: ['./report-templates.component.scss'],
})
export class ReportTemplatesComponent {
  filteredResourceIds: any[] = []; // filtered datasets based on search
  resourceIds: KeyValues[] = [];
  resourceId = new FormControl();
  resId: any;
  displayedColumns: string[] = ['layoutId', 'fileName'];
  dataSource: any;

  constructor(
    private API_Service: KVS_Service,
    public dialogService: MatDialog,
    public notifyService: NotificationService
  ) {}

  ngOnInit() {
    window.scrollTo(0, 0);
    this.fetchResourceIds();
    this.filteredResourceIds = this.resourceIds;
    this.resourceId.valueChanges
      .pipe(startWith('')) // start with an empty string
      .subscribe((value) => {
        this.filteredResourceIds = this.filterDataSets(value);
      });
  }

  filterDataSets(value: string): any[] {
    // filter the datasets based on the search value
    const filterValue = value.toString().toLowerCase();
    return this.resourceIds.filter((sets) =>
      sets.value.toString().toLowerCase().includes(filterValue)
    );
  }

  fetchResourceIds() {
    var parameters = '_dataset=22&_language=1';
    var request = {
      service: KeyValueStoreWebService.service,
      extension: KeyValueStoreWebService.qryKVS,
      parameters: parameters,
    };
    this.API_Service.getRequest(request)
      .then((data) => {
        if (data != null) {
          this.resourceIds = data.list;
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
  
  fetchAttachments(resourceId:any) {
    var parameters = '_resourceId='+resourceId;
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
    }
    else{
      this.dataSource.filter = '';
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
}
