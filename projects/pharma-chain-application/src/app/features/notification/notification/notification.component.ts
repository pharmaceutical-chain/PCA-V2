import { AuthService } from './../../../core/auth/auth.service';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { TransferService } from '../../transfer/transfer.service';
import { ITransfer_GET, ITransfer_CREATE } from '../../../shared/utils/transfer.interface';
import { NotificationService } from '../../../core/core.module';

@Component({
  selector: 'pca-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationComponent implements OnInit {

  data: ITransfer_GET[] = [];

  constructor(
    private transferService: TransferService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private readonly notificationService: NotificationService,
  ) { }

  async ngOnInit() {
    const tenantId = (await this.authService.getUser$().toPromise()).sub.slice(6);
    this.transferService.getTransfers().subscribe(res => {
      this.data = res.filter(t => t.toId === tenantId && t.isConfirmed === false);
      this.cdr.markForCheck();
    });
  }

  onClickContracAddress(address: string) {
    const url = `https://ropsten.etherscan.io/address/${address}#readContract`;
    window.open(url, '_blank');
  }

  onConfirm(transfer: ITransfer_GET) {
    const body: ITransfer_CREATE = {
      medicineBatchId: transfer.medicineBatchId,
      fromTenantId: transfer.fromId,
      toTenantId: transfer.toId,
      quantity: transfer.quantity,
      isConfirmed: true
    };

    this.transferService.updateTransfer(transfer.id, body).subscribe(res => {
      this.notificationService.success(`Confirmed ${transfer.batchNumber}!`);
      setTimeout(() => {
        this.notificationService.info('We are mining into blockchain...');
        this.data = this.data.filter(t => t.id !== transfer.id);
        this.cdr.markForCheck();
      }, 1000);
    });
  }
}
