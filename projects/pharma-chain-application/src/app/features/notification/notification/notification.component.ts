import { IBatch_GET, IBatch_CREATE } from './../../../shared/utils/batches.interface';
import { IMedicine_GET, IMedicine_CREATE } from './../../../shared/utils/medicines.interface';
import { AuthService } from './../../../core/auth/auth.service';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { TransferService } from '../../transfer/transfer.service';
import { ITransfer_GET, ITransfer_CREATE } from '../../../shared/utils/transfer.interface';
import { NotificationService } from '../../../core/core.module';
import { MedicineService } from '../../medicine/medicine.service';
import { BatchService } from '../../batch/batch.service';

@Component({
  selector: 'pca-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationComponent implements OnInit {

  transfers: ITransfer_GET[] = [];
  medicines: IMedicine_GET[] = [];
  batchs: IBatch_GET[] = [];
  isAdmin: boolean;

  constructor(
    private transferService: TransferService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private readonly notificationService: NotificationService,
    private medicineService: MedicineService,
    private batchService: BatchService,
  ) { }

  async ngOnInit() {
    this.isAdmin = await this.authService.isAdmin$.toPromise();
    if (this.isAdmin) {
      this.medicineService.getMedicines().subscribe(res => {
        this.medicines = res.filter(m => m.isApprovedByAdmin === false);
        this.medicines.map(medicine => {
          if (medicine.certificates) {
            medicine['certificatesView'] = medicine.certificates.split(',').map(id => id.substring(0, id.length - 41)).toString();
          }
        });
        this.cdr.markForCheck();
      });
      this.batchService.getBatches().subscribe(res => {
        this.batchs = res.filter(m => m.isApprovedByAdmin === false);
        this.batchs.map(batch => {
          if (batch.certificates) {
            batch['certificatesView'] = batch.certificates.split(',').map(id => id.substring(0, id.length - 41)).toString();
          }
        });
        this.cdr.markForCheck();
      });
    } else {
      const tenantId = (await this.authService.getUser$().toPromise()).sub.slice(6);
      this.transferService.getTransfers().subscribe(res => {
        this.transfers = res.filter(t => t.toId === tenantId && t.isConfirmed === false);
        this.cdr.markForCheck();
      });
    }
  }

  onClickContracAddress(address: string) {
    const url = `https://ropsten.etherscan.io/address/${address}#readContract`;
    window.open(url, '_blank');
  }

  // type = 0 : transfer; type = 1 : medicine; type = 2 : batch; 
  onConfirm(data, type) {
    switch (type) {
      case 0: {
        const transfer = data as ITransfer_GET;
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
            this.transfers = this.transfers.filter(t => t.id !== transfer.id);
            this.cdr.markForCheck();
          }, 1000);
        });
        break;
      }
      case 1: {
        const medicine = data as IMedicine_GET;
        const body: IMedicine_CREATE = {
          commercialName: medicine.commercialName,
          registrationCode: medicine.registrationCode,
          isPrescriptionMedicine: medicine.isPrescriptionMedicine,
          dosageForm: medicine.dosageForm,
          ingredientConcentration: medicine.ingredientConcentration,
          packingSpecification: medicine.packingSpecification,
          declaredPrice: Number(medicine.declaredPrice),
          currentlyLoggedInTenant: medicine.manufacturerId,
          certificates: medicine.certificates,
          isApprovedByAdmin: true
        };
        this.medicineService.updateMedicine(medicine.id, body).subscribe(() => {
          this.notificationService.success(`Confirmed ${medicine.commercialName}!`);
          setTimeout(() => {
            this.notificationService.info('We are mining into blockchain...');
            this.medicines = this.medicines.filter(t => t.id !== medicine.id);
            this.cdr.markForCheck();
          }, 1000);
        });
        break;
      }
      case 2: {
        const batch = data as IBatch_GET;
        const body: IBatch_CREATE = {
          batchNumber: batch.batchNumber,
          medicineId: batch.medicineId,
          manufacturerId: batch.manufacturerId,
          manufactureDate: batch.manufactureDate,
          expiryDate: batch.expiryDate,
          quantity: batch.quantity,
          unit: batch.unit,
          certificates: batch.certificates,
          isApprovedByAdmin: true
        };
        this.batchService.updateBatch(batch.id, body).subscribe(() => {
          this.notificationService.success(`Confirmed ${batch.batchNumber}!`);
          setTimeout(() => {
            this.notificationService.info('We are mining into blockchain...');
            this.batchs = this.batchs.filter(t => t.id !== batch.id);
            this.cdr.markForCheck();
          }, 1000);
        });
        break;
      }

      default:
        break;
    }
  }
}
