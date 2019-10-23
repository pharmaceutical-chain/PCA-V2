import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/core.module';
import { FormBuilder } from '@angular/forms';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'pca-overview-batch',
  templateUrl: './overview-batch.component.html',
  styleUrls: ['./overview-batch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewBatchComponent implements OnInit {

  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  currentPageNumberControl = this.fb.control(1, { updateOn: 'blur' });
  currentPageIndex = 0;
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  sortOptions = ['Business name', 'Created date'];

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  }

  // Trigger blur page number input
  onblur() {
    const maxPage = Math.ceil(this.length / this.pageSize);

    if (this.currentPageNumberControl.value < 1) {
      this.currentPageNumberControl.setValue(1);
    }
    if (this.currentPageNumberControl.value > maxPage) {
      this.currentPageNumberControl.setValue(maxPage);
    }

    this.currentPageIndex = this.currentPageNumberControl.value - 1;
  }

  // Trigger event of paginator without page number input
  pageEvent(event: PageEvent) {
    console.log(event);
    this.currentPageNumberControl.setValue(event.pageIndex + 1);
    this.pageSize = event.pageSize;
  }
}
