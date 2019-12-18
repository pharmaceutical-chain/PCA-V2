import browser from 'browser-detect';
import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as config from './../../../../../auth_config.json';
import { environment as env } from '../../environments/environment';

import {
  routeAnimations,
  AppState,
  LocalStorageService,
  selectSettingsStickyHeader,
  selectSettingsLanguage,
  selectEffectiveTheme
} from '../core/core.module';
import {
  actionSettingsChangeAnimationsPageDisabled,
  actionSettingsChangeLanguage
} from '../core/settings/settings.actions';
import { AuthService } from '../core/auth/auth.service';
import { MatSidenav } from '@angular/material';
import { features, Feature } from '../features/feature-list/feature-list.data';

@Component({
  selector: 'pca-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeAnimations]
})
export class AppComponent implements OnInit, AfterViewChecked {

  @ViewChild('menuIcon', { static: false }) menuIcon: ElementRef;
  @ViewChild('sidenav', { static: false }) sidenav: MatSidenav;

  isProd = env.production;
  envName = env.envName;
  version = env.versions.app;
  year = new Date().getFullYear();
  logo = require('../../assets/img/PHARMACHAIN-logo-white.png');
  languages = ['en'];

  navigationSideMenu: Feature[] = [
    { link: 'dashboard', label: 'pca.menu.features', icon: 'tachometer-alt', roles: ['admin', 'manufacturer', 'distributor', 'retailer'] },
    ...features,
    { link: 'settings', label: 'pca.menu.settings', icon: 'cog', roles: ['admin', 'manufacturer', 'distributor', 'retailer'] },
  ];

  isLgScreen = true;

  isAuthenticated: boolean;
  stickyHeader$: Observable<boolean>;
  language$: Observable<string>;
  theme$: Observable<string>;
  user: any;

  constructor(
    private store: Store<AppState>,
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private cdk: ChangeDetectorRef
  ) { }

  private static isIEorEdgeOrSafari() {
    return ['ie', 'edge', 'safari'].includes(browser().name);
  }

  async ngOnInit() {
    this.localStorageService.testLocalStorage();
    if (AppComponent.isIEorEdgeOrSafari()) {
      this.store.dispatch(
        actionSettingsChangeAnimationsPageDisabled({
          pageAnimationsDisabled: true
        })
      );
    }

    this.authService.loggedInSub$.subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated;
    });

    this.stickyHeader$ = this.store.pipe(select(selectSettingsStickyHeader));
    this.language$ = this.store.pipe(select(selectSettingsLanguage));
    this.theme$ = this.store.pipe(select(selectEffectiveTheme));
    this.authService.localAuthSetup();


    // observable with async thì có thể render khi observer emit dữ liệu nhưng ko cast được emit value
    // subject behaviour thì có thể
    this.authService.userProfile$.subscribe(res => {
      if (res) {
        // async pipe or ?. 
        // add prop roles for use in template instead ( config.namespace + 'roles' ) not use object.prop
        this.user = { ...res, roles: res[config.namespace + 'roles'] }

        // filter features following by user roles
        const role = res[config.namespace + 'roles'];
        this.navigationSideMenu = this.navigationSideMenu.filter(f => f.roles.includes(role));
      }
    });
  }

  ngAfterViewChecked(): void {
    if (this.menuIcon !== undefined) {
      if (this.isLgScreen !== this.isHidden(this.menuIcon['_elementRef']['nativeElement'])) {
        this.isLgScreen = this.isHidden(this.menuIcon['_elementRef']['nativeElement']);
        this.cdk.detectChanges();
      }
    }
  }

  onLogoutClick() {
    this.authService.logout();
  }

  onLanguageSelect({ value: language }) {
    this.store.dispatch(actionSettingsChangeLanguage({ language }));
  }

  getUser() {
    this.authService.getUser$().subscribe(res => console.log(res));
    this.authService.getTokenSilently$().subscribe(res => console.log(res));
  }

  onClickSidenav(matSidenav?: MatSidenav) {
    if (!matSidenav) {
      this.sidenav.toggle();
    } else {
      if (!this.isLgScreen) {
        matSidenav.close();
      }
    }
  }

  isHidden(el) {
    if (el['offsetParent'])
      return false;
    return true;
  }
}
