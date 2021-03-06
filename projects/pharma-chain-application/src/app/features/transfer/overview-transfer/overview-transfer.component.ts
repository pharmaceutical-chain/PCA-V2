import { ImageViewerComponent } from './../../../shared/image-viewer/image-viewer.component';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './../../../core/auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { ITransfer_GET } from './../../../shared/utils/transfer.interface';
import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/core.module';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent, MatDialog } from '@angular/material';
import { FormBuilder } from '@angular/forms';
import { detailExpand } from '../../../core/animations/element.animations';
import { TransferService } from '../transfer.service';

@Component({
  selector: 'pca-overview-transfer',
  templateUrl: './overview-transfer.component.html',
  styleUrls: ['./overview-transfer.component.scss'],
  animations: [detailExpand],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewTransferComponent implements OnInit {

  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  isAdmin: boolean;

  currentFilter: BehaviorSubject<number> = new BehaviorSubject(0);

  allTransfers: ITransfer_GET[] = [];
  numSent = 0;
  numReceived = 0;

  data: ITransfer_GET[] = [];
  columnsToDisplay = ['to', 'medicine', 'batchNumber', 'date', 'time'];
  dataSource: MatTableDataSource<ITransfer_GET>;
  expandedElement: ITransfer_GET | null;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  currentPageNumberControl = this.fb.control(1, { updateOn: 'blur' });
  currentPageIndex = 0;
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  constructor(private fb: FormBuilder,
    private transferService: TransferService,
    private authService: AuthService,
    private translate: TranslateService,
    private dialog: MatDialog) { }

  async ngOnInit() {
    this.isAdmin = await this.authService.isAdmin$.toPromise();
    const tenantId = (await this.authService.getUser$().toPromise()).sub.slice(6);

    this.allTransfers = await this.transferService.getTransfers().toPromise();
    this.numSent = this.allTransfers.filter(t => t.fromId === tenantId).length;
    this.numReceived = this.allTransfers.filter(t => t.toId === tenantId).length;
    this.data = this.isAdmin ? this.allTransfers : this.allTransfers.filter(t => t.fromId === tenantId);

    // Initiate value for matTableDataSource
    this.initiateMatTableDataSource();

    if (!this.isAdmin) {
      this.currentFilter.subscribe(value => {
        if (value === 0) {
          this.data = this.isAdmin ? this.allTransfers : this.allTransfers.filter(t => t.fromId === tenantId);
          this.columnsToDisplay[0] = 'to';
        } else if (value === 1) {
          this.data = this.isAdmin ? this.allTransfers : this.allTransfers.filter(t => t.toId === tenantId);
          this.columnsToDisplay[0] = 'from';
        }
        // Reinitiate
        this.initiateMatTableDataSource();
      });
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

  translateByKey(key: string) {
    return this.translate.get(`pca.transfer.form.${key}`);
  }


  onClickTransactionHash(txh: string) {
    const url = `https://ropsten.etherscan.io/tx/${txh}`;
    window.open(url, '_blank');
  }

  onClickContracAddress(address: string) {
    const url = `https://ropsten.etherscan.io/address/${address}#readContract`;
    window.open(url, '_blank');
  }

  onClickDelete(batchId: string) {

  }

  verifyBatch(tenantId: string, batchId: string) {
    const url = `http://pharmachain-verificator.herokuapp.com/${tenantId}/${batchId}`;
    window.open(url, '_blank');
  }

  async generateQR(tenantId: string, batchId: string) {
    const src = await this.transferService.generateQR(tenantId, batchId).toPromise();
    this.dialog.open(ImageViewerComponent, {
      data: 'data:image/png;base64,' + src  
    });
  }

  ///////////////////////////// Utils
  initiateMatTableDataSource() {
    const currentFilter = this.dataSource ? this.dataSource.filter : '';
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.filterPredicate = (data: ITransfer_GET, filters: string) => {
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
