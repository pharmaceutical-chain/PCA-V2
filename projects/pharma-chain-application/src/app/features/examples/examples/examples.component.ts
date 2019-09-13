import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import { routeAnimations } from '../../../core/core.module';

import { State } from '../examples.state';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'pca-examples',
  templateUrl: './examples.component.html',
  styleUrls: ['./examples.component.scss'],
  animations: [routeAnimations],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExamplesComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;

  examples = [
    { link: 'todos', label: 'pca.examples.menu.todos' },
    { link: 'stock-market', label: 'pca.examples.menu.stocks' },
    { link: 'theming', label: 'pca.examples.menu.theming' },
    { link: 'crud', label: 'pca.examples.menu.crud' },
    {
      link: 'simple-state-management',
      label: 'pca.examples.menu.simple-state-management'
    },
    { link: 'form', label: 'pca.examples.menu.form' },
    { link: 'notifications', label: 'pca.examples.menu.notifications' },
    { link: 'elements', label: 'pca.examples.menu.elements' },
    { link: 'authenticated', label: 'pca.examples.menu.auth', auth: true }
  ];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
  }
}
