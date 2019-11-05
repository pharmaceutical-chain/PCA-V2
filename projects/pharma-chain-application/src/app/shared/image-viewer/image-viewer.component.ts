import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'pca-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageViewerComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ImageViewerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

}
