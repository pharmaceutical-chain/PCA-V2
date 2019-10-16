import { TransferEffects } from './transfer.effects';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransferRoutingModule } from './transfer-routing.module';
import { TransferComponent } from './transfer/transfer.component';
import { EnterTransferComponent } from './enter-transfer/enter-transfer.component';
import { OverviewTransferComponent } from './overview-transfer/overview-transfer.component';
import { EffectsModule } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared/shared.module';
import { environment } from '../../../environments/environment';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    `${environment.i18nPrefix}/assets/i18n/transfer/`,
    '.json'
  );
}

@NgModule({
  declarations: [TransferComponent, OverviewTransferComponent, EnterTransferComponent],
  imports: [
    CommonModule,
    SharedModule,
    TransferRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      isolate: true
    }),
    EffectsModule.forFeature([
      TransferEffects,
    ])
  ]
})
export class TransferModule { }
