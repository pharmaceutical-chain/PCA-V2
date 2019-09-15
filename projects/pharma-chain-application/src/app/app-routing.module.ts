import { AdminGuard } from './core/auth/admin.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { CallbackComponent } from './core/auth/callback/callback.component';
import { AuthGuard } from './core/core.module';

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
    loadChildren: () =>
      import('./features/feature-list/feature-list.module').then(m => m.FeatureListModule)
  },
  {
    path: 'tenant',
    canActivate: [AdminGuard],
    loadChildren: () =>
    import('./features/tenant/tenant.module').then(m => m.TenantModule)
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
