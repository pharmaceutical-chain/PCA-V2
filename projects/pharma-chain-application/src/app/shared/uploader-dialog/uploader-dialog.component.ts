import { Component, OnInit, ChangeDetectionStrategy, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UploaderService } from '../../core/core.module';
import { forkJoin } from 'rxjs';
import { ICertificate } from '../utils/certificates.interface';

@Component({
  selector: 'pca-uploader-dialog',
  templateUrl: './uploader-dialog.component.html',
  styleUrls: ['./uploader-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploaderDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public certificates: Set<ICertificate>,
    public dialogRef: MatDialogRef<UploaderDialogComponent>,
    private uploaderService: UploaderService) {}

  progress;
  canBeClosed = true;
  primaryButtonText = 'Upload';
  showCancelButton = true;
  uploading = false;
  uploadSuccessful = false;

  ngOnInit() { 
    console.log(this.certificates)
  }

  closeDialog() {
    // if everything was uploaded already, just close the dialog
    if (this.uploadSuccessful) {
      return this.dialogRef.close();
    }

    // set the component state to "uploading"
    this.uploading = true;

    // start the upload and save the progress map
    this.progress = this.uploaderService.upload(this.certificates);
    console.log(this.progress);
    for (const key in this.progress) {
      if (this.progress.hasOwnProperty(key)) {
        this.progress[key].progress.subscribe(val => console.log(key + ': ' + val));
        this.progress[key].link.subscribe(val => console.log(key + ': ' + val));
      }
    }

    // convert the progress map into an array
    const allProgressObservables = [];
    for (const key in this.progress) {
      if (this.progress.hasOwnProperty(key)) {
        allProgressObservables.push(this.progress[key].progress);
      }
    }

    // Adjust the state variables

    // The OK-button should have the text "Finish" now
    this.primaryButtonText = 'Finish';

    // The dialog should not be closed while uploading
    this.canBeClosed = false;
    this.dialogRef.disableClose = true;

    // Hide the cancel-button
    this.showCancelButton = false;

    // When all progress-observables are completed...
    forkJoin(allProgressObservables).subscribe(end => {
      // ... the dialog can be closed again...
      this.canBeClosed = true;
      this.dialogRef.disableClose = false;

      // ... the upload was successful...
      this.uploadSuccessful = true;

      // ... and the component is no longer uploading
      this.uploading = false;
    });
  }
}
