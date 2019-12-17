import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/core.module';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'pca-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  isAuthenticated: boolean;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.loggedInSub$.subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated;
    });
  }

  onLoginClick() {
    this.authService.login('feature-list');
  }
}
