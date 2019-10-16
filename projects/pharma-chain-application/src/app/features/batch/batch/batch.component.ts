import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { routeAnimations } from '../../../core/core.module';

@Component({
  selector: 'pca-batch',
  templateUrl: './batch.component.html',
  styleUrls: ['./batch.component.scss'],
  animations: [routeAnimations],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BatchComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
