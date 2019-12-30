import { ConfirmationDialogComponent } from './../../../shared/confirmation-dialog/confirmation-dialog.component';
import { ITenant_GET } from './../../../shared/utils/tenants.interface';
import { TenantService } from './../tenant.service';
import { FormBuilder } from '@angular/forms';
import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ROUTE_ANIMATIONS_ELEMENTS, NotificationService } from '../../../core/core.module';
import { PageEvent, MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { detailExpand } from '../../../core/animations/element.animations';
import { ImageViewerComponent } from '../../../shared/image-viewer/image-viewer.component';
import { Router } from '@angular/router';
import { PdfViewerComponent } from '../../../shared/pdf-viewer/pdf-viewer.component';

enum TYPE_TENANT {
  ALL = 0,
  MANUFACTURER = 1,
  DISTRIBUTOR = 2,
  RETAILER = 3
}

@Component({
  selector: 'pca-overview-tenant',
  templateUrl: './overview-tenant.component.html',
  styleUrls: ['./overview-tenant.component.scss'],
  animations: [detailExpand],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewTenantComponent implements OnInit {

  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  data: ITenant_GET[] = [];
  columnsToDisplay = ['type', 'name', 'dateCreated'];
  dataSource: MatTableDataSource<ITenant_GET>;
  expandedElement: ITenant_GET | null;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  currentPageNumberControl = this.fb.control(1, { updateOn: 'blur' });
  currentPageIndex = 0;
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  currentFilter: TYPE_TENANT = TYPE_TENANT.ALL;
  currentSearching = '';

  numManufacturer = 0;
  numDistributor = 0;
  numRetailer = 0;

  constructor(private fb: FormBuilder,
    private tenantService: TenantService,
    private dialog: MatDialog,
    private readonly notificationService: NotificationService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    this.data = await this.tenantService.getTenants().toPromise();
    this.data.map(tenant => {
      tenant.dateCreated = (new Date(tenant.dateCreated)).toLocaleDateString();
      if (tenant.certificates) {
        const idlinks = tenant.certificates.split(',');
        tenant.links = idlinks.map(id => `https://lamle.blob.core.windows.net/tenant-certificates/${id}`);
        tenant.certificates = idlinks.map(id => id.split('-')[0]);
      }
    });
    this.updateFilterCounter();
    // Initiate value
    this.initiateMatTableDataSource();
  }

  applyFilter(filterValue: string) {
    let filterType = '';
    switch (this.currentFilter) {
      case TYPE_TENANT.MANUFACTURER:
        filterType = 'manufacturer';
        break;
      case TYPE_TENANT.DISTRIBUTOR:
        filterType = 'distributor';
        break;
      case TYPE_TENANT.RETAILER:
        filterType = 'retailer';
        break;

      default:
        break;
    }

    this.dataSource.filter = (filterValue + ' ' + filterType).trim().toLowerCase();

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

  camelCaseToTitle(camelCase: string): string {
    const result = camelCase.replace(/([A-Z])/g, x => ` ${x.toLowerCase()}`);
    return result.charAt(0).toUpperCase() + result.slice(1);
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

  onClickDelete(tenantId: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);

    dialogRef.componentInstance.confirmTitle = 'Delete tenant';
    dialogRef.componentInstance.confirmMessage = 'Are you sure, that will delete tenant out of system?';
    dialogRef.componentInstance.confirmButtonColor = 'warn';

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.tenantService.deleteTenant(tenantId).subscribe(() => {
          this.notificationService.success('Delete tenant successfully!');
          this.data.splice(this.data.findIndex((tenant: ITenant_GET) => tenant.id === tenantId), 1);

          // Reinitiate
          this.initiateMatTableDataSource();
          this.updateFilterCounter();
          this.cdr.detectChanges();
        });
      }
    });
  }

  onClickUpdate(tenantId: string) {
    this.router.navigate(['/tenant/update-tenant', { tenantId }])
  }

  ///////////////////////////// Utils
  initiateMatTableDataSource() {
    const currentFilter = this.dataSource ? this.dataSource.filter : '';
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.filterPredicate = (data: ITenant_GET, filters: string) => {
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

  updateFilterCounter() {
    this.numManufacturer = this.data.filter(t => t.type === 'Manufacturer').length;
    this.numDistributor = this.data.filter(t => t.type === 'Distributor').length;
    this.numRetailer = this.data.filter(t => t.type === 'Retailer').length;
  }
}
