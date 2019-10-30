import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MedicineRoutingModule } from './medicine-routing.module';
import { MedicineComponent } from './medicine/medicine.component';
import { EnterMedicineComponent } from './enter-medicine/enter-medicine.component';
import { OverviewMedicineComponent } from './overview-medicine/overview-medicine.component';
import { MedicineEffects } from './medicine.effects';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from '../../../environments/environment';
import { SharedModule } from '../../shared/shared.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { EffectsModule } from '@ngrx/effects';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    `${environment.i18nPrefix}/assets/i18n/medicine/`,
    '.json'
  );
}

@NgModule({
  declarations: [MedicineComponent, EnterMedicineComponent, OverviewMedicineComponent],
  imports: [
    CommonModule,
    SharedModule,
    MedicineRoutingModule,
    PdfViewerModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      isolate: true
    }),
    EffectsModule.forFeature([
      MedicineEffects,
    ])
  ]
})
export class MedicineModule { }
