import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/core.module';

@Component({
  selector: 'pca-overview-tenant',
  templateUrl: './overview-tenant.component.html',
  styleUrls: ['./overview-tenant.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewTenantComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  sortOptions = ['Business name', 'Issued date'];

  tenants = [
    {
      name: 'Công ty Cổ phần Thiết bị Y tế Medinsco',
      issuedDate: '2019/10/10',
      taxCode: '122314342',
      registrationCode: '147 / ĐKKDĐ-BYT',
      type: 'Manufacturer',
      addresses: 'Kho K4 số 118 đường Nguyễn Văn Trỗi, phường Phương Liệt, Quận Thanh Xuân, TP. Hà Nội',
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
      name: 'Công ty Cổ phần Thiết bị Y tế Medinsco Medinsco Medinsco Medinsco Medinsco',
      issuedDate: '2019/10/10',
      taxCode: '122314342',
      registrationCode: '147 / ĐKKDĐ-BYT',
      type: 'Manufacturer',
      addresses: 'Kho K4 số 118 đường Nguyễn Văn Trỗi, phường Phương Liệt, Quận Thanh Xuân, TP. Hà Nội',
      goodPractices: '(1) 685 / GCN-QLD (GSP); ',
      certificates: [
        {
          name: '685 / GCN-QLD (GSP)',
          file: 'https://5.imimg.com/data5/WV/RS/MY-42249117/gmp-good-manufacturing-practice-certification-consultancy-service-500x500.jpg'
        }
      ]
    },
    {
      name: 'Công ty Cổ phần Thiết bị Y tế Medinsco Medinsco Medinsco Medinsco Medinsco',
      issuedDate: '2019/10/10',
      taxCode: '122314342',
      registrationCode: '147 / ĐKKDĐ-BYT',
      type: 'Manufacturer',
      addresses: 'Kho K4 số 118 đường Nguyễn Văn Trỗi, phường Phương Liệt, Quận Thanh Xuân, TP. Hà Nội',
      goodPractices: '(1) 685 / GCN-QLD (GSP); ',
      certificates: [
        {
          name: '685 / GCN-QLD (GSP)',
          file: 'https://5.imimg.com/data5/WV/RS/MY-42249117/gmp-good-manufacturing-practice-certification-consultancy-service-500x500.jpg'
        }
      ]
    },
    {
      name: 'Công ty Cổ phần Thiết bị Y tế Medinsco Medinsco Medinsco Medinsco Medinsco',
      issuedDate: '2019/10/10',
      taxCode: '122314342',
      registrationCode: '147 / ĐKKDĐ-BYT',
      type: 'Manufacturer',
      addresses: 'Kho K4 số 118 đường Nguyễn Văn Trỗi, phường Phương Liệt, Quận Thanh Xuân, TP. Hà Nội',
      goodPractices: '(1) 685 / GCN-QLD (GSP); ',
      certificates: [
        {
          name: '685 / GCN-QLD (GSP)',
          file: 'https://5.imimg.com/data5/WV/RS/MY-42249117/gmp-good-manufacturing-practice-certification-consultancy-service-500x500.jpg'
        }
      ]
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
