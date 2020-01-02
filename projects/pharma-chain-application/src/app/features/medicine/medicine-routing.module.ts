import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MedicineComponent } from './medicine/medicine.component';
import { EnterMedicineComponent } from './enter-medicine/enter-medicine.component';
import { OverviewMedicineComponent } from './overview-medicine/overview-medicine.component';

const routes: Routes = [
  {
    path: '',
    component: MedicineComponent,
    children: [
      {
        path: '',
        redirectTo: 'overview-medicine',
        pathMatch: 'full'
      },
      {
        path: 'enter-medicine',
        component: EnterMedicineComponent,
        data: { title: 'pca.medicine.enter' }
      },
      {
        path: 'update-medicine',
        component: EnterMedicineComponent,
        data: { title: 'pca.medicine.update' }
      },
      {
        path: 'overview-medicine',
        component: OverviewMedicineComponent,
        data: { title: 'pca.medicine.overview' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicineRoutingModule { }
