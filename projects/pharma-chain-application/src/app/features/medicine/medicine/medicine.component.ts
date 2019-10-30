import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { routeAnimations } from '../../../core/core.module';

@Component({
  selector: 'pca-medicine',
  templateUrl: './medicine.component.html',
  styleUrls: ['./medicine.component.scss'],
  animations: [routeAnimations],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MedicineComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
