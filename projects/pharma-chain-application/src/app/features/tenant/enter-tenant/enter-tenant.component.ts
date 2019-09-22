import { BehaviorSubject } from 'rxjs';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/core.module';
import { FormBuilder, Validators } from '@angular/forms';
import { PDFDocumentProxy, PDFSource, PDFProgressData } from 'ng2-pdf-viewer';

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


  pdfSrc$ = new BehaviorSubject<string | PDFSource | ArrayBuffer>('');
  pdf: any;
  isLoaded = false;
  error: any;
  progressData: PDFProgressData;

  constructor(
    private fb: FormBuilder,
  ) {
  }

  ngOnInit() {
  }

  /**
  * Render PDF preview on selecting file
  */
  onFileSelected() {
    const $pdf: any = document.querySelector('#file');

    if (typeof FileReader !== 'undefined') {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.pdfSrc$.next(e.target.result);
      };

      reader.readAsArrayBuffer($pdf.files[0]);
    }
  }

  /**
  * Pdf loading progress callback
  * @param {PDFProgressData} progressData
  */
  onProgress(progressData: PDFProgressData) {
    this.progressData = progressData;
    this.isLoaded = false;
    this.error = null;
  }

  /**
   * Get int value for progress bar for loading progress file
   * @param value 
   */
  getInt(value: number): number {
    return Math.round(value);
  }

  /**
  * Get pdf information after it's loaded
  * @param pdf
  */
  afterLoadComplete(pdf: PDFDocumentProxy) {
    this.pdf = pdf;
    this.isLoaded = true;
  }

  /**
   * Handle error callback
   *
   * @param error
   */
  onError(error: any) {
    this.error = error;

    if (error.name === 'PasswordException') {
      const password = prompt(
        'This document is password protected. Enter the password:'
      );

      if (password) {
        this.error = null;
        this.setPassword(password);
      }
    }
  }

  /**
   * Handle adding password to access this loading file
   * @param password 
   */
  setPassword(password: string) {
    let newSrc;

    const pdfSrc = this.pdfSrc$.toPromise();

    if (pdfSrc instanceof ArrayBuffer) {
      newSrc = { data: pdfSrc };
    } else if (typeof pdfSrc === 'string') {
      newSrc = { url: pdfSrc };
    } else {
      newSrc = { ...pdfSrc };
    }

    newSrc.password = password;

    this.pdfSrc$.next(newSrc);
  }

  /**
  * Page rendered callback, which is called when a page is rendered (called multiple times)
  *
  * @param {CustomEvent} e
  */
  pageRendered(e: CustomEvent) {
    console.log('(page-rendered)', e);
  }

}
