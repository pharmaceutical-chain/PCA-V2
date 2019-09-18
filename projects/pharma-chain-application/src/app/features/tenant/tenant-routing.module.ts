import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnterTenantComponent } from './enter-tenant/enter-tenant.component';
import { TenantComponent } from './tenant/tenant.component';
import { OverviewTenantComponent } from './overview-tenant/overview-tenant.component';

const routes: Routes = [
  {
    path: '',
    component: TenantComponent,
    children: [
      {
        path: '',
        redirectTo: 'overview-tenant',
        pathMatch: 'full'
      },
      {
        path: 'enter-tenant',
        component: EnterTenantComponent,
        data: { title: 'enter tenant' }
      },
      {
        path: 'overview-tenant',
        component: OverviewTenantComponent,
        data: { title: 'overview tenant' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TenantRoutingModule { }
