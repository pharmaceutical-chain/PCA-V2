import { OverviewBatchComponent } from './overview-batch/overview-batch.component';
import { EnterBatchComponent } from './enter-batch/enter-batch.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BatchComponent } from './batch/batch.component';

const routes: Routes = [
  {
    path: '',
    component: BatchComponent,
    children: [
      {
        path: '',
        redirectTo: 'overview-batch',
        pathMatch: 'full'
      },
      {
        path: 'enter-batch',
        component: EnterBatchComponent,
        data: { title: 'pca.batch.enter' }
      },
      {
        path: 'update-batch',
        component: EnterBatchComponent,
        data: { title: 'pca.batch.update' }
      },
      {
        path: 'overview-batch',
        component: OverviewBatchComponent,
        data: { title: 'pca.batch.overview' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BatchRoutingModule { }
