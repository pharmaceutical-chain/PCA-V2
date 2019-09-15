import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { routeAnimations } from '../../../core/core.module';

@Component({
  selector: 'pca-tenant',
  templateUrl: './tenant.component.html',
  styleUrls: ['./tenant.component.scss'],
  animations: [routeAnimations],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TenantComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
