import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BatchRoutingModule } from './batch-routing.module';
import { BatchComponent } from './batch/batch.component';
import { SharedModule } from '../../shared/shared.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from '../../../environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { BatchEffects } from './batch.effects';
import { OverviewBatchComponent } from './overview-batch/overview-batch.component';
import { EnterBatchComponent } from './enter-batch/enter-batch.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    `${environment.i18nPrefix}/assets/i18n/batch/`,
    '.json'
  );
}

@NgModule({
  declarations: [BatchComponent, OverviewBatchComponent, EnterBatchComponent],
  imports: [
    CommonModule,
    SharedModule,
    BatchRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      isolate: true
    }),
    EffectsModule.forFeature([
      BatchEffects,
    ])
  ]
})
export class BatchModule { }
