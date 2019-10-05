import { PdfViewerComponent } from './../../../shared/pdf-viewer/pdf-viewer.component';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/core.module';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { PDFDocumentProxy, PDFProgressData } from 'ng2-pdf-viewer';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'pca-enter-tenant',
  templateUrl: './enter-tenant.component.html',
  styleUrls: ['./enter-tenant.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnterTenantComponent implements OnInit {

  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  types = ['Manufacturer', 'Distributor', 'Retailer'];

  form = this.fb.group({
    name: ['', [Validators.required]],
    taxCode: ['', [Validators.required]],
    registrationCode: ['', [Validators.required]],
    type: ['', [Validators.required]],
    addresses: ['', [Validators.required]],
    goodPractices: [''],
    certificates: this.fb.array([])
  });

  pdfSrc: Array<any> = [];
  pdfSrc$ = new BehaviorSubject<any>(this.pdfSrc);
  pdf: Array<PDFDocumentProxy> = [];
  isLoading = false; // presented all pdf on view
  currentPageRendered = [];
  error: Array<any> = [];
  progressData: PDFProgressData;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.certificatesFormArray.valueChanges.subscribe(() => this.form.get('goodPractices').setValue(this.certificateNames));
  }

  submit() {
    console.log(this.form.value);
  }

  get certificatesFormArray(): FormArray {
    return this.form.get('certificates') as FormArray;
  }

  get certificateNames(): string {
    let name = '';
    for (let i = 0; i < this.certificatesFormArray.length; i++) {
      const certificateNameAt = this.certificatesFormArray.at(i).get('name').value;
      if (certificateNameAt !== '') {
        name += `(${i + 1}) ${certificateNameAt}; `;
      }
    }

    return name;
  }

  addCertificate(certificateFile: File) {
    const certificate = this.fb.group({
      name: ['', [Validators.required]],
      file: [certificateFile, [Validators.required]]
    });

    this.certificatesFormArray.push(certificate);
  }

  removeCertificate(index: number) {
    this.certificatesFormArray.removeAt(index);
    this.pdfSrc.splice(index, 1);
    this.pdfSrc$.next(this.pdfSrc);
  }

  viewDetailPDF(index: number) {
    const dialogRef = this.dialog.open(PdfViewerComponent, {
      data: this.pdfSrc[index]
    });

    dialogRef.afterClosed().subscribe();
  }

  /**
  * Render PDF preview on selecting file
  */
  onFileSelected() {
    const $pdf: any = document.querySelector('#file');

    if ((typeof FileReader !== 'undefined') && ($pdf.files.length !== 0)) {
      this.isLoading = true;

      for (let i = 0; i < $pdf.files.length; i++) {
        const reader = new FileReader();

        reader.onloadend = (e: any) => {
          this.addCertificate($pdf.files[i]);
          this.pdfSrc.push(e.target.result);
          this.pdfSrc$.next(this.pdfSrc);
        };

        reader.readAsArrayBuffer($pdf.files[i]);
      }
    }
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
  afterLoadComplete(pdf: PDFDocumentProxy, index: number) {
    this.pdf.push(pdf);
  }

  /**
   * Handle error callback
   *
   * @param error
   */
  onError(error: any, index: number) {
    this.error[index] = error;

    if (error.name === 'PasswordException') {
      const password = prompt(
        'This document is password protected. Enter the password:'
      );

      if (password) {
        this.error[index] = null;
        this.setPassword(password, index);
      }
    }
  }

  /**
   * Handle adding password to access this loading file
   * @param password 
   */
  setPassword(password: string, index: number) {
    let newSrc;

    const pdfSrc = this.pdfSrc[index];

    if (pdfSrc instanceof ArrayBuffer) {
      newSrc = { data: pdfSrc };
    } else if (typeof pdfSrc === 'string') {
      newSrc = { url: pdfSrc };
    } else {
      newSrc = { ...pdfSrc };
    }

    newSrc.password = password;

    this.pdfSrc[index] = newSrc;
    this.pdfSrc$.next(this.pdfSrc);
  }

  /**
  * Page rendered callback, which is called when a page is rendered (called multiple times)
  *
  * @param {CustomEvent} e
  */
  pageRendered(e: CustomEvent, index: number) {
    console.log(`(page-${index}-rendered)`, e);
    this.currentPageRendered[index] = e['pageNumber'];
    this.isLoading = false;
  }
}
