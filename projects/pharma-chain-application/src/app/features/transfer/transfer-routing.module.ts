import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransferComponent } from './transfer/transfer.component';
import { EnterTransferComponent } from './enter-transfer/enter-transfer.component';
import { OverviewTransferComponent } from './overview-transfer/overview-transfer.component';

const routes: Routes = [
  {
    path: '',
    component: TransferComponent,
    children: [
      {
        path: '',
        redirectTo: 'overview-transfer',
        pathMatch: 'full'
      },
      {
        path: 'enter-transfer',
        component: EnterTransferComponent,
        data: { title: 'pca.transfer.enter' }
      },
      {
        path: 'overview-transfer',
        component: OverviewTransferComponent,
        data: { title: 'pca.transfer.overview' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransferRoutingModule { }
