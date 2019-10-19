import { ITenant_GET } from './../../../shared/utils/tenants.interface';
import { TenantService } from './../tenant.service';
import { FormBuilder } from '@angular/forms';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/core.module';
import { PageEvent } from '@angular/material';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'pca-overview-tenant',
  templateUrl: './overview-tenant.component.html',
  styleUrls: ['./overview-tenant.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewTenantComponent implements OnInit {

  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  currentPageNumberControl = this.fb.control(1, { updateOn: 'blur' });
  currentPageIndex = 0;
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  sortOptions = ['Business name', 'Created date'];
  sort = 'name';
  filter = 'Manufacturer';

  branchAddress = ['Kho K4 số 118 đường Nguyễn Văn Trỗi', 'Kho K4 số 118 đường Nguyễn Văn Trỗi'];
  goodPractices = '(1) 685 / GCN-QLD (GSP); (2) 685 / GCN-QLD (GSP); (3) 685 / GCN-QLD (GSP); ';
  certificates = [
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

  tenants: Observable<ITenant_GET[]>;

  constructor(private fb: FormBuilder,
    private tenantService: TenantService) { }

  ngOnInit() {
    this.tenants = this.tenantService.getTenants().pipe(
      tap(res => console.log(res))
    );
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

  onClickContracAddress(address: string) {
    const url = `https://ropsten.etherscan.io/address/${address}#code`;
    window.open(url, '_blank');
  }

  onClickDelete(tenantId: string) {
    this.tenantService.deleteTenant(tenantId).subscribe(res => console.log(res));
  }

}
