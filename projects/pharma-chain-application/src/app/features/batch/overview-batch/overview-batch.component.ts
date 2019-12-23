import { BatchService } from './../batch.service';
import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/core.module';
import { FormBuilder } from '@angular/forms';
import { PageEvent, MatTableDataSource, MatDialog, MatSort, MatPaginator } from '@angular/material';
import { ImageViewerComponent } from '../../../shared/image-viewer/image-viewer.component';
import { detailExpand } from '../../../core/animations/element.animations';
import { IBatch_GET } from '../../../shared/utils/batches.interface';

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
  columnsToDisplay = ['manufacturer', 'commercialName', 'batchNumber', 'dateCreated'];
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

  branchAddress = ['Kho K4 số 118 đường Nguyễn Văn Trỗi', 'Kho K4 số 118 đường Nguyễn Văn Trỗi'];
  constructor(private fb: FormBuilder,
    private batchService: BatchService,
    private dialog: MatDialog) { }

  async ngOnInit() {
    this.data = await this.batchService.getBatches().toPromise();

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
    const dialogRef = this.dialog.open(ImageViewerComponent, {
      data: src
    });

    dialogRef.afterClosed().subscribe();
  }

  onClickDelete(batchId: string) {

  }
}
