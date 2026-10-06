import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { KVS_Service } from 'src/KVS_service';
import { KeyValueStoreWebService } from 'src/WebServices/KeyValueStoreWebService';
import { Releases } from 'src/models/Releases';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDialog } from '@angular/material/dialog';
import { ReleasesFormComponent } from '../releases-form/releases-form.component';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { NotificationService } from 'src/Services/notification.service';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-releases',
  templateUrl: './releases.component.html',
  styleUrls: ['./releases.component.scss'],
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    FlexLayoutModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    DatePipe
  ],
})
export class ReleasesComponent implements AfterViewInit {
  displayedColumns: string[] = ['release', 'date', 'notes', 'edit', 'delete'];
  releases: Releases[] = [];
  dataSource: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('inputRef') inputRef!: ElementRef<HTMLInputElement>;

  constructor(
    private API_Service: KVS_Service,
    public dialogService: MatDialog,
    public router: Router,
    public dialog: MatDialog,
    public notifyService: NotificationService
  ) {}
  ngAfterViewInit() {
    this.fetchReleases();
    window.scrollTo(0, 0);
  }

  parseApiDate(date: string): Date | null {
    if (!date) {
      return null;
    }

    const timestamp = date.match(/\d+/)?.[0];

    return timestamp ? new Date(Number(timestamp)) : null;
  }
  
  fetchReleases() {
  var parameters = '';

  var request = {
    service: KeyValueStoreWebService.service,
    extension: KeyValueStoreWebService.qryRelease,
    parameters: parameters,
  };

  this.API_Service.getRequest(request)
    .then((data) => {
      if (data != null) {
        this.releases = data.list.map((item: any) => ({
          ...item,
          date: this.parseApiDate(item.date)
        }));

        this.dataSource = new MatTableDataSource<Releases>(
          this.releases
        );

        this.dataSource.paginator = this.paginator;

        const inputValue = this.inputRef.nativeElement.value;
        this.applyFilter(inputValue);
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
    const dialogRef = this.dialogService.open(ReleasesFormComponent, {
      data: {
        mode: 'add',
        release: null
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        this.fetchReleases();
      }
    });
  }

  openEditDialog(element: Releases) {
    const dialogRef = this.dialogService.open(ReleasesFormComponent, {
      data: {
        mode: 'edit',
        release: element
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        this.fetchReleases();
      }
    });
  }

  startEdit(row: Releases) {
    this.router.navigate(['/releaseGuide/' + row.release]);
  }

  applyFilter(filterValue: string) {
    if (filterValue) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    } else {
      this.dataSource.filter = '';
    }
  }

  public deleteRow(element: any): void {
    var request = {
      service: KeyValueStoreWebService.service,
      extension: KeyValueStoreWebService.delRelease,
    };
    this.API_Service.postRequest(request, element)
      .then((data) => {
        if (data != null) {
          this.notifyService.showSuccess(
            'Record Deleted Successfully',
            'Success'
          );

          this.fetchReleases();
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

  openConfirmationDialog(element: any): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px', 
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.deleteRow(element);
      }
    });
  }

  deleteItem(event: Event, element: any) {
    event.stopPropagation(); 
    this.openConfirmationDialog(element);
  }
}
