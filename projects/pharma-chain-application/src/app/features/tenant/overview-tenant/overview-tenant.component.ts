import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/core.module';

@Component({
  selector: 'pca-overview-tenant',
  templateUrl: './overview-tenant.component.html',
  styleUrls: ['./overview-tenant.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewTenantComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  
  constructor() { }

  ngOnInit() {
  }

}
