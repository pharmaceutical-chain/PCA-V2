import { BatchService } from './../batch.service';
import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ROUTE_ANIMATIONS_ELEMENTS, NotificationService } from '../../../core/core.module';
import { FormBuilder } from '@angular/forms';
import { PageEvent, MatTableDataSource, MatDialog, MatSort, MatPaginator } from '@angular/material';
import { detailExpand } from '../../../core/animations/element.animations';
import { IBatch_GET } from '../../../shared/utils/batches.interface';
import { PdfViewerComponent } from '../../../shared/pdf-viewer/pdf-viewer.component';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'pca-overview-batch',
  templateUrl: './overview-batch.component.html',
  styleUrls: ['./overview-batch.component.scss'],
  animations: [detailExpand],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewBatchComponent implements OnInit {

  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  data: IBatch_GET[] = [];
  columnsToDisplay = ['batchNumber', 'commercialName', 'dateCreated'];
  dataSource: MatTableDataSource<IBatch_GET>;
  expandedElement: IBatch_GET | null;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  currentPageNumberControl = this.fb.control(1, { updateOn: 'blur' });
  currentPageIndex = 0;
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  currentSearching = '';

  constructor(private fb: FormBuilder,
    private batchService: BatchService,
    private dialog: MatDialog,
    private readonly notificationService: NotificationService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private translate: TranslateService
  ) { }

  async ngOnInit() {
    this.data = await this.batchService.getBatches().toPromise();
    this.data.map(batch => {
      if (batch.certificates) {
        const idlinks = batch.certificates.split(',');
        batch['links'] = idlinks.map(id => `https://lamle.blob.core.windows.net/tenant-certificates/${id}`);
        batch.certificates = idlinks.map(id => id.substring(0, id.length - 41)).toString();
      }
    });
    this.initiateMatTableDataSource();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = (filterValue).trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      this.length = this.dataSource.paginator.length;
    }
  }

  // Trigger blur page number input
  onblur() {
    if (this.currentPageIndex !== this.currentPageNumberControl.value - 1) {
      const maxPage = Math.ceil(this.length / this.pageSize);
      if (this.currentPageNumberControl.value < 1) {
        this.currentPageNumberControl.setValue(1);
      }
      if (this.currentPageNumberControl.value > maxPage) {
        this.currentPageNumberControl.setValue(maxPage);
      }
      this.currentPageIndex = this.currentPageNumberControl.value - 1;
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      });
    }
  }

  // Trigger event of paginator without page number input
  pageEvent(event: PageEvent) {
    console.log(event);
    this.currentPageNumberControl.setValue(event.pageIndex + 1);
    this.pageSize = event.pageSize;
    this.length = event.length;
  }

  translateByKey(key: string) {
    return this.translate.get(`pca.batch.form.${key}`);
  }

  onClickTransactionHash(txh: string) {
    const url = `https://ropsten.etherscan.io/tx/${txh}`;
    window.open(url, '_blank');
  }

  onClickContracAddress(address: string) {
    const url = `https://ropsten.etherscan.io/address/${address}#readContract`;
    window.open(url, '_blank');
  }

  viewDetailCertificate(src: string) {
    const dialogRef = this.dialog.open(PdfViewerComponent, {
      data: src
    });
    dialogRef.afterClosed().subscribe();
  }

  onClickDelete(batchId: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    dialogRef.componentInstance.confirmTitle = 'Delete batch';
    dialogRef.componentInstance.confirmMessage = 'Are you sure, that will delete batch out of system?';
    dialogRef.componentInstance.confirmButtonColor = 'warn';
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.batchService.deleteBatch(batchId).subscribe(() => {
          this.notificationService.success('Delete batch successfully!');
          this.data.splice(this.data.findIndex((batch: IBatch_GET) => batch.id === batchId), 1);
          // Reinitiate
          this.initiateMatTableDataSource();
          this.cdr.detectChanges();
        });
      }
    });
  }

  onClickUpdate(batchId: string) {
    this.router.navigate(['/batch/update-batch', { batchId }])
  }

  initiateMatTableDataSource() {
    const currentFilter = this.dataSource ? this.dataSource.filter : '';
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (data: IBatch_GET, filters: string) => {
      const matchFilter = [];
      const filterArray = filters.split(' ');
      const columns = (<any>Object).values(data);
      // OR be more specific [data.name, data.race, data.color];
      // Main
      filterArray.forEach(filter => {
        const customFilter = [];
        columns.forEach(column => {
          if (column) {
            customFilter.push(column.toString().toLowerCase().includes(filter));
          }
        });
        matchFilter.push(customFilter.some(Boolean)); // OR
      });
      return matchFilter.every(Boolean); // AND
    }
    this.dataSource.filter = currentFilter;
  }
}
