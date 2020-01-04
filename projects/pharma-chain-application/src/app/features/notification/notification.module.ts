import { NotificationEffects } from './notification.effects';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationRoutingModule } from './notification-routing.module';
import { NotificationComponent } from './notification/notification.component';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from '../../../environments/environment';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { EffectsModule } from '@ngrx/effects';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    `${environment.i18nPrefix}/assets/i18n/notification/`,
    '.json'
  );
}
@NgModule({
  declarations: [NotificationComponent],
  imports: [
    CommonModule,
    SharedModule,
    NotificationRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      isolate: true
    }),
    EffectsModule.forFeature([
      NotificationEffects,
    ])
  ]
})
export class NotificationModule { }
