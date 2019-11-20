import { ITransfer_SEARCH } from './../../../shared/utils/transfer.interface';
import { IBatch_SEARCH } from './../../../shared/utils/batches.interface';
import { TransferService } from './../transfer.service';
import { TenantService } from './../../tenant/tenant.service';
import { ITenant_SEARCH } from './../../../shared/utils/tenants.interface';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ROUTE_ANIMATIONS_ELEMENTS, NotificationService } from '../../../core/core.module';
import { IMedicine_SEARCH } from '../../../shared/utils/medicines.interface';
import { Observable } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { AuthService } from '../../../core/auth/auth.service';
import { Router } from '@angular/router';
import { BatchService } from '../../batch/batch.service';
import { MedicineService } from '../../medicine/medicine.service';
import { startWith, map, tap } from 'rxjs/operators';

@Component({
  selector: 'pca-enter-transfer',
  templateUrl: './enter-transfer.component.html',
  styleUrls: ['./enter-transfer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnterTransferComponent implements OnInit {

  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  allBatches: Array<IBatch_SEARCH> = [];
  allTransfers: Array<ITransfer_SEARCH> = [];

  tenantOptions: Array<ITenant_SEARCH> = [];
  tenantFromFilteredOptions: Observable<Array<ITenant_SEARCH>>;
  tenantToFilteredOptions: Observable<Array<ITenant_SEARCH>>;

  medicineOptions: Array<IMedicine_SEARCH> = [];
  medicineFilteredOptions: Observable<Array<IMedicine_SEARCH>>;

  batchesBelongTenant: Array<IBatch_SEARCH> = [];
  batchOptions: Array<IBatch_SEARCH> = [];
  batchFilteredOptions: Observable<Array<IBatch_SEARCH>>;

  form = this.fb.group({
    medicineId: ['', [Validators.required]],
    medicineBatchId: ['', [Validators.required]],
    fromTenantId: ['', [Validators.required]],
    toTenantId: ['', [Validators.required]],
    quantity: [1, [Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private authService: AuthService,
    private readonly notificationService: NotificationService,
    private router: Router,
    private tenantService: TenantService,
    private batchService: BatchService,
    private transferService: TransferService
  ) {
  }

  async ngOnInit() {
    this.batchService.getBatchesForSearch().subscribe(res => this.allBatches = res);
    this.transferService.getTransfersForSearch().subscribe(res => this.allTransfers = res);
    this.tenantOptions = await this.tenantService.getTenantForSearch().toPromise();

    //////////// Auto complete for FROM TENANT - ONLY ADMIN
    this.tenantFromFilteredOptions = this.form.get('fromTenantId').valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(value => value ? this._filterTenant(value) : this.tenantOptions.slice()),
      );

    //////////// Auto complete for TO TENANT
    this.tenantToFilteredOptions = this.form.get('toTenantId').valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(value => value ? this._filterTenant(value) : this.tenantOptions.slice()),
      );

    //////////// Auto complete for MEDICINE
    this.medicineFilteredOptions = this.form.get('medicineId').valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : `${value.commercialName} / ${value.ingredientConcentration}`),
        map(value => value ? this._filterMedicine(value) : this.medicineOptions.slice())
      );

    //////////// Auto complete for BATCH
    this.batchFilteredOptions = this.form.get('medicineBatchId').valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : `${value.commercialName} / ${value.ingredientConcentration}`),
        map(value => value ? this._filterBatch(value) : this.batchOptions.slice()),
      );

    //////////// Quantity
    this.form.get('quantity').valueChanges.subscribe(value => {
      if (value < 0) {
        this.form.get('quantity').setValue(0);
      }
      if (value > this.form.get('medicineBatchId').value['quantity']) {
        this.form.get('quantity').setValue(this.form.get('medicineBatchId').value['quantity']);
      }
    });
  }

  //////////// Auto complete for FROM TENANT
  displayTenantFn(option?: ITenant_SEARCH): string | undefined {
    return option ? option.name : undefined;
  }

  private _filterTenant(value: string): Array<ITenant_SEARCH> {
    const filterValue = value.toLowerCase();
    return this.tenantOptions
      .filter(option => option.name.toLowerCase().indexOf(filterValue) !== -1);
  }

  //////////// Auto complete for MEDICINE
  displayMedicineFn(option?: IMedicine_SEARCH): string | undefined {
    return option ? `${option.commercialName} / ${option.ingredientConcentration}` : undefined;
  }

  private _filterMedicine(value: string): Array<IMedicine_SEARCH> {
    const filterValue = value.toLowerCase();
    return this.medicineOptions
      .filter(option => `${option.commercialName} / ${option.ingredientConcentration}`.toLowerCase().indexOf(filterValue) !== -1);
  }

  //////////// Auto complete for BATCH
  displayBatchFn(option?: IBatch_SEARCH): string | undefined {
    return option ? option.batchNumber : undefined;
  }

  private _filterBatch(value: string): Array<IBatch_SEARCH> {
    const filterValue = value.toLowerCase();
    return this.batchOptions
      .filter(option => option.batchNumber.toLowerCase().indexOf(filterValue) !== -1);
  }


  async submit() {
    if (this.form.valid) {
      this.form.get('fromTenantId').setValue(this.form.get('fromTenantId').value !== '' ? this.form.get('fromTenantId').value.id : (await this.authService.getUser$().toPromise()).sub.slice(6), { emitModelToViewChange: false });
      this.form.get('toTenantId').setValue(this.form.get('toTenantId').value.id, { emitModelToViewChange: false });
      this.form.get('medicineBatchId').setValue(this.form.get('medicineBatchId').value.batchId, { emitModelToViewChange: false });

      this.transferService.createTransfer(this.form.value).subscribe(res => {
        if (res) {
          this.notificationService.success('Enter transfer successfully!');
          setTimeout(() => {
            this.router.navigate(['/transfer/overview-transfer']).then(() => {
              setTimeout(() => {
                this.notificationService.info('We are mining into blockchain...');
              }, 1000);
            });
          }, 1000);
        }
      });
    }
  }

  async onFocusMedicine() {
    const tenantId = this.form.get('fromTenantId').value !== '' ? this.form.get('fromTenantId').value['id'] : (await this.authService.getUser$().toPromise()).sub.slice(6);
    const batchesCreated = this.allBatches.filter(b => b.manufacturerId === tenantId);
    const batchesReceived = this.allTransfers.filter(t => t.to === tenantId);
    const batchesAvaiable = [...batchesCreated, ...batchesReceived];
    const medicinesAvaible = batchesAvaiable.map(m => ({ id: m.medicineId, registrationCode: m.medicineCode, commercialName: m.commercialName, ingredientConcentration: m.ingredientConcentration } as IMedicine_SEARCH));



    this.medicineOptions = medicinesAvaible.map(ar => JSON.stringify(ar))
      .filter((itm, idx, arr) => arr.indexOf(itm) === idx)
      .map(str => JSON.parse(str));

    this.form.get('medicineId').updateValueAndValidity({ onlySelf: true });

    this.batchesBelongTenant = batchesAvaiable;
  }

  onFocusBatch() {
    this.batchOptions = this.batchesBelongTenant.filter(b => b.medicineId === this.form.get('medicineId').value['id']);
    this.form.get('medicineBatchId').updateValueAndValidity({ onlySelf: true });
  }

  onClickSubQuantity() {
    this.form.get('quantity').setValue(this.form.get('quantity').value - 1);
  }

  onClickAddQuantity() {
    this.form.get('quantity').setValue(this.form.get('quantity').value + 1);
  }
}
