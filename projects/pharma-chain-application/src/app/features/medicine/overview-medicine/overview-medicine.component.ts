import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/core.module';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent, MatDialog } from '@angular/material';
import { FormBuilder } from '@angular/forms';
import { detailExpand } from '../../../core/animations/element.animations';
import { MedicineService } from '../medicine.service';
import { IMedicine_GET } from '../../../shared/utils/medicines.interface';
import { ImageViewerComponent } from '../../../shared/image-viewer/image-viewer.component';

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

  goodPractices = '(1) 685 / GCN-QLD (GSP); (2) 685 / GCN-QLD (GSP); ';
  certificates = [
    {
      name: '685 / GCN-QLD (GSP)',
      file: 'https://5.imimg.com/data5/WV/RS/MY-42249117/gmp-good-manufacturing-practice-certification-consultancy-service-500x500.jpg'
    },
    {
      name: '685 / GCN-QLD (GSP)',
      file: 'https://5.imimg.com/data5/WV/RS/MY-42249117/gmp-good-manufacturing-practice-certification-consultancy-service-500x500.jpg'
    }
  ]

  constructor(
    private fb: FormBuilder,
    private medicineService: MedicineService,
    private dialog: MatDialog,
  ) {
  }

  async ngOnInit() {
    this.data = await this.medicineService.getMedicines().toPromise();

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
    const url = `https://etherscan.io/tx/${txh}`;
    window.open(url, '_blank');
  }

  onClickContracAddress(address: string) {
    const url = `https://ropsten.etherscan.io/address/${address}#code`;
    window.open(url, '_blank');
  }

  viewDetailCertificate(src: string) {
    const dialogRef = this.dialog.open(ImageViewerComponent, {
      data: src
    });

    dialogRef.afterClosed().subscribe();
  }

  onClickDelete(medicineId: string) {
  }
}

