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
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'pca-enter-transfer',
  templateUrl: './enter-transfer.component.html',
  styleUrls: ['./enter-transfer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnterTransferComponent implements OnInit {

  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  medicineOptions: Array<IMedicine_SEARCH>;
  filteredOptions: Observable<Array<IMedicine_SEARCH>>;

  form = this.fb.group({
    medicineBatchId: ['', [Validators.required]],
    fromTenantId: ['', [Validators.required]],
    toTenantId: ['', [Validators.required]],
    quantity: ['', [Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private authService: AuthService,
    private readonly notificationService: NotificationService,
    private router: Router,
    private batchService: BatchService,
    private medicineService: MedicineService
  ) {
  }

  async ngOnInit() {
    this.medicineOptions = await this.medicineService.getMedicinesForSearch().toPromise();
    this.filteredOptions = this.form.get('medicineBatchId').valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.medicineOptions.slice()),
      );
  }

  displayFn(option?: IMedicine_SEARCH): string | undefined {
    return option ? `${option.commercialName} / ${option.ingredientConcentration}` : undefined;
  }

  private _filter(value: string): Array<IMedicine_SEARCH> {
    const filterValue = value.toLowerCase();
    return this.medicineOptions
      .filter(option => option.commercialName.toLowerCase().indexOf(filterValue) !== -1
        || option.ingredientConcentration.toLowerCase().indexOf(filterValue) !== -1);
  }

  async submit() {
    //   if (this.form.valid) {
    //     this.form.get('medicineId').setValue(this.form.get('medicineId').value.id, { emitModelToViewChange: false });
    //     this.form.get('manufacturingDate').setValue((this.form.get('manufacturingDate').value as Date).toLocaleDateString(), { emitModelToViewChange: false });
    //     this.form.get('expiryDate').setValue((this.form.get('expiryDate').value as Date).toLocaleDateString(), { emitModelToViewChange: false });

    //     const manufacturerId = this.form.get('manufacturerId').value !== '' ? this.form.get('manufacturerId').value : (await this.authService.getUser$().toPromise()).sub.slice(6);
    //     const batch = {
    //       ...this.form.value,
    //       manufacturerId: manufacturerId
    //     }

    //     this.batchService.createBatch(batch).subscribe(res => {
    //       if (res) {
    //         this.notificationService.success('Enter batch successfully!');
    //         setTimeout(() => {
    //           this.router.navigate(['/batch/overview-batch']).then(() => {
    //             setTimeout(() => {
    //               this.notificationService.info('We are mining into blockchain...');
    //             }, 1000);
    //           });
    //         }, 1000);
    //       }
    //     });
    //   }
    console.log(this.form.value);

    this.notificationService.success('Enter transfer successfully!');
    setTimeout(() => {
      this.router.navigate(['/transfer/overview-transfer']).then(() => {
        setTimeout(() => {
          this.notificationService.info('We are mining into blockchain...');
        }, 1000);
      });
    }, 1000);
  }
}
