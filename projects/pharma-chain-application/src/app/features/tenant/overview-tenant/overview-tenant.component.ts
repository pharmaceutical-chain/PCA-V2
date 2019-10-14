import { FormBuilder } from '@angular/forms';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/core.module';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'pca-overview-tenant',
  templateUrl: './overview-tenant.component.html',
  styleUrls: ['./overview-tenant.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewTenantComponent implements OnInit {

  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  currentPageNumberControl = this._fb.control(1, { updateOn: 'blur' });
  currentPageIndex = 0;
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  sortOptions = ['Business name', 'Created date'];
  sort = 'name';
  filter = 'Manufacturer';

  tenants = [
    {
      id: '1',
      name: 'Công ty Cổ phần Thiết bị Y tế Medinsco',
      issuedDate: '2019/10/10',
      taxCode: '122314342',
      registrationCode: '147 / ĐKKDĐ-BYT',
      txh: '0x2ca85229c49047d20cf7de8e3686484a0109df05e2a8415114d84676ebd7d574',
      type: 'Manufacturer',
      primaryAddress: 'Kho K4 số 118 đường Nguyễn Văn Trỗi, phường Phương Liệt, Quận Thanh Xuân, TP. Hà Nội',
      branchAddress: ['Kho K4 số 118 đường Nguyễn Văn Trỗi', 'Kho K4 số 118 đường Nguyễn Văn Trỗi'],
      goodPractices: '(1) 685 / GCN-QLD (GSP); (2) 685 / GCN-QLD (GSP); (3) 685 / GCN-QLD (GSP); ',
      certificates: [
        {
          name: '685 / GCN-QLD (GSP)',
          file: 'https://5.imimg.com/data5/WV/RS/MY-42249117/gmp-good-manufacturing-practice-certification-consultancy-service-500x500.jpg'
        },
        {
          name: '685 / GCN-QLD (GSP)',
          file: 'https://5.imimg.com/data5/WV/RS/MY-42249117/gmp-good-manufacturing-practice-certification-consultancy-service-500x500.jpg'
        },
        {
          name: '685 / GCN-QLD (GSP)',
          file: 'https://5.imimg.com/data5/WV/RS/MY-42249117/gmp-good-manufacturing-practice-certification-consultancy-service-500x500.jpg'
        }
      ]
    },
    {
      id: '2',
      name: 'Công ty Cổ phần Thiết bị Y tế Medinsco Medinsco Medinsco Medinsco Medinsco',
      issuedDate: '2019/10/10',
      taxCode: '122314342',
      registrationCode: '147 / ĐKKDĐ-BYT',
      txh: '0x2ca85229c49047d20cf7de8e3686484a0109df05e2a8415114d84676ebd7d574',
      type: 'Manufacturer',
      primaryAddress: 'Kho K4 số 118 đường Nguyễn Văn Trỗi, phường Phương Liệt, Quận Thanh Xuân, TP. Hà Nội',
      branchAddress: ['Kho K4 số 118 đường Nguyễn Văn Trỗi', 'Kho K4 số 118 đường Nguyễn Văn Trỗi'],
      goodPractices: '(1) 685 / GCN-QLD (GSP); ',
      certificates: [
        {
          name: '685 / GCN-QLD (GSP)',
          file: 'https://5.imimg.com/data5/WV/RS/MY-42249117/gmp-good-manufacturing-practice-certification-consultancy-service-500x500.jpg'
        }
      ]
    },
    {
      id: '3',
      name: 'Công ty Cổ phần Thiết bị Y tế Medinsco Medinsco Medinsco Medinsco Medinsco',
      issuedDate: '2019/10/10',
      taxCode: '122314342',
      registrationCode: '147 / ĐKKDĐ-BYT',
      txh: '0x2ca85229c49047d20cf7de8e3686484a0109df05e2a8415114d84676ebd7d574',
      type: 'Manufacturer',
      primaryAddress: 'Kho K4 số 118 đường Nguyễn Văn Trỗi, phường Phương Liệt, Quận Thanh Xuân, TP. Hà Nội',
      branchAddress: ['Kho K4 số 118 đường Nguyễn Văn Trỗi', 'Kho K4 số 118 đường Nguyễn Văn Trỗi'],
      goodPractices: '(1) 685 / GCN-QLD (GSP); ',
      certificates: [
        {
          name: '685 / GCN-QLD (GSP)',
          file: 'https://5.imimg.com/data5/WV/RS/MY-42249117/gmp-good-manufacturing-practice-certification-consultancy-service-500x500.jpg'
        }
      ]
    },
    {
      id: '4',
      name: 'Công ty Cổ phần Thiết bị Y tế Medinsco Medinsco Medinsco Medinsco Medinsco',
      issuedDate: '2019/10/10',
      taxCode: '122314342',
      registrationCode: '147 / ĐKKDĐ-BYT',
      txh: '0x2ca85229c49047d20cf7de8e3686484a0109df05e2a8415114d84676ebd7d574',
      type: 'Manufacturer',
      primaryAddress: 'Kho K4 số 118 đường Nguyễn Văn Trỗi, phường Phương Liệt, Quận Thanh Xuân, TP. Hà Nội',
      branchAddress: ['Kho K4 số 118 đường Nguyễn Văn Trỗi', 'Kho K4 số 118 đường Nguyễn Văn Trỗi'],
      goodPractices: '(1) 685 / GCN-QLD (GSP); ',
      certificates: [
        {
          name: '685 / GCN-QLD (GSP)',
          file: 'https://5.imimg.com/data5/WV/RS/MY-42249117/gmp-good-manufacturing-practice-certification-consultancy-service-500x500.jpg'
        }
      ]
    }
  ];

  constructor(private _fb: FormBuilder) { }

  ngOnInit() {
  }

  // Trigger blur page number input
  onblur() {
    const maxPage = Math.ceil(this.length / this.pageSize);

    if (this.currentPageNumberControl.value < 1) {
      this.currentPageNumberControl.setValue(1);
    }
    if (this.currentPageNumberControl.value > maxPage) {
      this.currentPageNumberControl.setValue(maxPage);
    }

    this.currentPageIndex = this.currentPageNumberControl.value - 1;
  }

  // Trigger event of paginator without page number input
  pageEvent(event: PageEvent) {
    console.log(event);
    this.currentPageNumberControl.setValue(event.pageIndex + 1);
    this.pageSize = event.pageSize;
  }

  onClickTransactionHash(txh: string) {
    const url = `https://etherscan.io/tx/${txh}`;
    window.open(url, '_blank');
  }

}
