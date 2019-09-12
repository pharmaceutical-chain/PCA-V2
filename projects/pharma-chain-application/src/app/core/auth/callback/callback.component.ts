import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'pca-app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CallbackComponent implements OnInit {
  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.auth.handleAuthCallback();
  }
}
