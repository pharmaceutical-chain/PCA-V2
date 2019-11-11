import { BehaviorSubject } from 'rxjs';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import * as config from './../../../../../../../auth_config.json';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/core.module';

import { Feature, features } from '../feature-list.data';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'pca-feature-list',
  templateUrl: './feature-list.component.html',
  styleUrls: ['./feature-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeatureListComponent implements OnInit {

  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  features: BehaviorSubject<Feature[]> = new BehaviorSubject(features);

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.getUser$().subscribe(res => {
      const role = res[config.namespace + 'roles'];
      this.features.next(this.features.value.filter(f => f.roles.includes(role)));
    });
  }

  openLink(link: string) {
    window.open(link, '_blank');
  }
}
