import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Subject } from 'rxjs';
import { LoaderService } from '../../core/http-loader/http-loader.service';

@Component({
  selector: 'pca-http-loader',
  templateUrl: './http-loader.component.html',
  styleUrls: ['./http-loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HttpLoaderComponent {

  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  isLoading: Subject<boolean> = this.loaderService.isLoading;

  constructor(private loaderService: LoaderService) { }
}
