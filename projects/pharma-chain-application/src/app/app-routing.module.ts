import { BatchGuard } from './core/auth/batch.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { CallbackComponent } from './core/auth/callback/callback.component';
import { AuthGuard } from './core/core.module';
import { TenantGuard } from './core/auth/tenant.guard';
import { TransferGuard } from './core/auth/transfer.guard';
import { MedicineGuard } from './core/auth/medicine.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'about',
    pathMatch: 'full'
  },
  {
    path: 'callback',
    component: CallbackComponent
  },
  {
    path: 'about',
    loadChildren: () =>
      import('./features/about/about.module').then(m => m.AboutModule)
  },
  {
    path: 'feature-list',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/feature-list/feature-list.module').then(m => m.FeatureListModule)
  },
  {
    path: 'tenant',
    canActivate: [TenantGuard],
    loadChildren: () =>
    import('./features/tenant/tenant.module').then(m => m.TenantModule)
  },
  {
    path: 'medicine',
    canActivate: [MedicineGuard],
    loadChildren: () =>
    import('./features/medicine/medicine.module').then(m => m.MedicineModule)
  },
  {
    path: 'batch',
    canActivate: [BatchGuard],
    loadChildren: () =>
    import('./features/batch/batch.module').then(m => m.BatchModule)
  },
  {
    path: 'transfer',
    canActivate: [TransferGuard],
    loadChildren: () =>
    import('./features/transfer/transfer.module').then(m => m.TransferModule)
  },
  {
    path: 'settings',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/settings/settings.module').then(m => m.SettingsModule)
  },
  {
    path: 'examples',
    loadChildren: () =>
      import('./features/examples/examples.module').then(m => m.ExamplesModule)
  },
  {
    path: '**',
    redirectTo: 'about'
  }
];

@NgModule({
  // useHash supports github.io demo page, remove in your app
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
