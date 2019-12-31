import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ROUTE_ANIMATIONS_ELEMENTS, NotificationService } from '../../../core/core.module';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent, MatDialog } from '@angular/material';
import { FormBuilder } from '@angular/forms';
import { detailExpand } from '../../../core/animations/element.animations';
import { MedicineService } from '../medicine.service';
import { IMedicine_GET } from '../../../shared/utils/medicines.interface';
import { PdfViewerComponent } from '../../../shared/pdf-viewer/pdf-viewer.component';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'pca-overview-medicine',
  templateUrl: './overview-medicine.component.html',
  styleUrls: ['./overview-medicine.component.scss'],
  animations: [detailExpand],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewMedicineComponent implements OnInit {

  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  data: IMedicine_GET[] = [];
  columnsToDisplay = ['manufacturer', 'registrationCode', 'commercialName', 'ingredientConcentration', 'dateCreated'];
  dataSource: MatTableDataSource<IMedicine_GET>;
  expandedElement: IMedicine_GET | null;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  currentPageNumberControl = this.fb.control(1, { updateOn: 'blur' });
  currentPageIndex = 0;
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  constructor(
    private fb: FormBuilder,
    private medicineService: MedicineService,
    private dialog: MatDialog,
    private readonly notificationService: NotificationService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    this.data = await this.medicineService.getMedicines().toPromise();
    this.data.map(medicine => {
      if (medicine.certificates) {
        const idlinks = medicine.certificates.split(',');
        medicine['links'] = idlinks.map(id => `https://lamle.blob.core.windows.net/tenant-certificates/${id}`);
        medicine.certificates = idlinks.map(id => id.substring(0, id.length - 41)).toString();
      }
    });
    console.log(this.data);
    this.initiateMatTableDataSource();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

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

  onClickDelete(medicineId: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);

    dialogRef.componentInstance.confirmTitle = 'Delete tenant';
    dialogRef.componentInstance.confirmMessage = 'Are you sure, that will delete tenant out of system?';
    dialogRef.componentInstance.confirmButtonColor = 'warn';

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.medicineService.deleteMedicine(medicineId).subscribe(() => {
          this.notificationService.success('Delete tenant successfully!');
          this.data.splice(this.data.findIndex((medicine: IMedicine_GET) => medicine.id === medicineId), 1);
          // Reinitiate
          this.initiateMatTableDataSource();
          this.cdr.detectChanges();
        });
      }
    });
  }

  onClickUpdate(medicineId: string) {
    this.router.navigate(['/medicine/update-medicine', { medicineId }])
  }

  initiateMatTableDataSource() {
    const currentFilter = this.dataSource ? this.dataSource.filter : '';
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.filterPredicate = (data: IMedicine_GET, filters: string) => {
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

