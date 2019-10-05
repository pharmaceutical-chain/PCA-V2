import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'pca-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdfViewerComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<PdfViewerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}


  ngOnInit() {
  }

}
