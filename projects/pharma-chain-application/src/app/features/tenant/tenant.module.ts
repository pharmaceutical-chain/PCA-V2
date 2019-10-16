import { SharedModule } from './../../shared/shared.module';
import { environment } from '../../../environments/environment';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { TenantRoutingModule } from './tenant-routing.module';
import { EnterTenantComponent } from './enter-tenant/enter-tenant.component';
import { TenantComponent } from './tenant/tenant.component';
import { OverviewTenantComponent } from './overview-tenant/overview-tenant.component';
import { EffectsModule } from '@ngrx/effects';
import { TenantEffects } from './tenant.effects';
import { PdfViewerModule } from 'ng2-pdf-viewer';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    `${environment.i18nPrefix}/assets/i18n/tenant/`,
    '.json'
  );
}

@NgModule({
  declarations: [EnterTenantComponent, TenantComponent, OverviewTenantComponent],
  imports: [
    CommonModule,
    SharedModule,
    TenantRoutingModule,
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
      TenantEffects,
    ])
  ]
})
export class TenantModule { }
