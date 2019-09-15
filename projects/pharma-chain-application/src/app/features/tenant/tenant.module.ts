import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TenantRoutingModule } from './tenant-routing.module';
import { EnterTenantComponent } from './enter-tenant/enter-tenant.component';
import { TenantComponent } from './tenant/tenant.component';
import { OverviewTenantComponent } from './overview-tenant/overview-tenant.component';

@NgModule({
  declarations: [EnterTenantComponent, TenantComponent, OverviewTenantComponent],
  imports: [
    CommonModule,
    SharedModule,
    TenantRoutingModule
  ]
})
export class TenantModule { }
