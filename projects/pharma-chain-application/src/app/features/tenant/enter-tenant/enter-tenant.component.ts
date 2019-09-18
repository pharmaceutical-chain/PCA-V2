import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/core.module';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'pca-enter-tenant',
  templateUrl: './enter-tenant.component.html',
  styleUrls: ['./enter-tenant.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnterTenantComponent implements OnInit {

  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  form = this.fb.group({
    autosave: false,
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    description: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(1000)
      ]
    ],
    requestGift: [''],
    birthday: ['', [Validators.required]],
    rating: [0, Validators.required]
  });

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
  }

}
