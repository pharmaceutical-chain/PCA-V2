import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'pca-loading-dot',
  templateUrl: './loading-dot.component.html',
  styleUrls: ['./loading-dot.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingDotComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
