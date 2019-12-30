import { ITransfer_GET } from './../../../shared/utils/transfer.interface';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import * as CanvasJS from './../../../../assets/canvasjs.min.js';
import { FormControl } from '@angular/forms';
import { TransferService } from '../../transfer/transfer.service.js';
import { AuthService } from '../../../core/auth/auth.service.js';

@Component({
  selector: 'pca-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportComponent implements OnInit {

  years = [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029];
  currentYear: FormControl = new FormControl();
  states = ['Sent', 'Received']
  currentState: FormControl = new FormControl();
  chart;
  isAdmin: boolean;
  tenantId: string;

  constructor(
    private transferService: TransferService,
    private authService: AuthService
  ) { }

  async ngOnInit() {
    this.chart = new CanvasJS.Chart('chartContainer', {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: ''
      },
      data: [{
        type: 'column',
        dataPoints: [
          { y: 7, label: 'Jan' },
          { y: 5, label: 'Feb' },
          { y: 5, label: 'Mar' },
          { y: 6, label: 'Apr' },
          { y: 9, label: 'May' },
          { y: 6, label: 'Jun' },
          { y: 2, label: 'Jul' },
          { y: 3, label: 'Aug' },
          { y: 4, label: 'Sep' },
          { y: 9, label: 'Oct' },
          { y: 1, label: 'Nov' },
          { y: 3, label: 'Dec' }
        ]
      }]
    });

    this.isAdmin = await this.authService.isAdmin$.toPromise();
    this.tenantId = (await this.authService.getUser$().toPromise()).sub.slice(6);
    const transfers = (await this.transferService.getTransfers().toPromise());

    this.currentYear.setValue(this.years[0]);
    this.currentState.setValue(this.states[0]);
    this.render(transfers);

    this.currentYear.valueChanges.subscribe(() => {
      this.render(transfers);
    });
    this.currentState.valueChanges.subscribe(() => {
      this.render(transfers);
    });
  }

  render(transfers: ITransfer_GET[]) {
    this.chart.options.title.text = `Summary ${this.currentState.value} Transfer Monthly of ${this.currentYear.value}`;
    this.chart.options.data[0].dataPoints = this.convertToDataPoints(transfers);
    this.chart.render();
  }

  convertToDataPoints(transfers: ITransfer_GET[]) {
    if (!this.isAdmin) {
      if (this.currentState.value === this.states[0]) {
        transfers = transfers.filter(t => t.fromId === this.tenantId);
      } else if (this.currentState.value === this.states[1]) {
        transfers = transfers.filter(t => t.toId === this.tenantId);
      }
    }

    const points = [
      { y: 0, label: 'Jan' },
      { y: 0, label: 'Feb' },
      { y: 0, label: 'Mar' },
      { y: 0, label: 'Apr' },
      { y: 0, label: 'May' },
      { y: 0, label: 'Jun' },
      { y: 0, label: 'Jul' },
      { y: 0, label: 'Aug' },
      { y: 0, label: 'Sep' },
      { y: 0, label: 'Oct' },
      { y: 0, label: 'Nov' },
      { y: 0, label: 'Dec' }
    ];
    transfers.forEach(transfer => {
      const date = new Date(transfer.date);
      if (date.getFullYear() === this.currentYear.value) {
        points[date.getMonth()].y++;
      }
    });

    return points;
  }
}
