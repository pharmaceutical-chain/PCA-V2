import { Router, ActivatedRoute } from '@angular/router';
import { TenantService } from './../tenant.service';
import { PdfViewerComponent } from './../../../shared/pdf-viewer/pdf-viewer.component';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ROUTE_ANIMATIONS_ELEMENTS, NotificationService } from '../../../core/core.module';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { PDFProgressData } from 'ng2-pdf-viewer';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material';
import { UploaderDialogComponent } from '../../../shared/uploader-dialog/uploader-dialog.component';

@Component({
  selector: 'pca-enter-tenant',
  templateUrl: './enter-tenant.component.html',
  styleUrls: ['./enter-tenant.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnterTenantComponent implements OnInit {

  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  tenantId: string;
  tenant: any;

  types = ['Manufacturer', 'Distributor', 'Retailer'];

  form = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    taxCode: ['', [Validators.required]],
    registrationCode: ['', [Validators.required]],
    type: ['', [Validators.required]],
    phoneNumber: [''],
    primaryAddress: ['', [Validators.required]],
    branchAddress: this.fb.array([]),
    goodPractices: [''],
    certificates: this.fb.array([])
  });

  pdfSrc: Array<File> = [];
  pdfSrc$ = new BehaviorSubject<Array<File>>(this.pdfSrc);
  isLoading = false; // presented all pdf on view
  currentPageRendered = [];
  error: Array<any> = [];
  progressData: PDFProgressData;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private tenantService: TenantService,
    private router: Router,
    private route: ActivatedRoute,
    private readonly notificationService: NotificationService,
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(async res => {
      this.tenantId = res['tenantId'];

      if (this.tenantId) {
        this.tenant = await this.tenantService.getTenants(this.tenantId).toPromise();
        if (this.tenant) {
          this.form.patchValue({
            name: this.tenant['name'],
            email: this.tenant['email'],
            taxCode: this.tenant['taxCode'],
            registrationCode: this.tenant['registrationCode'],
            type: this.tenant['type'],
            phoneNumber: this.tenant['phoneNumber'],
            primaryAddress: this.tenant['primaryAddress'],
            goodPractices: this.tenant['goodPractices'],
          });
        }
      }
    });

    this.certificatesFormArray.valueChanges.subscribe(() => this.form.get('goodPractices').setValue(this.certificateNames));
  }

  submit() {
    if (this.form.valid) {
      if (this.tenantId) {
        this.tenantService.updateTenant(this.tenantId, this.form.value).subscribe(res => {
          if (res) {
            this.notificationService.success('Update tenant successfully!');
            setTimeout(() => {
              this.router.navigate(['/tenant/overview-tenant']).then(() => {
                setTimeout(() => {
                  this.notificationService.info('We are mining into blockchain...');
                }, 1000);
              });
            }, 1000);
          }
        });
      } else {
        this.tenantService.createTenant(this.form.value).subscribe(res => {
          if (res) {
            this.notificationService.success('Enter tenant successfully!');
            setTimeout(() => {
              this.router.navigate(['/tenant/overview-tenant']).then(() => {
                setTimeout(() => {
                  this.notificationService.info('We are mining into blockchain...');
                }, 1000);
              });
            }, 1000);
          }
        });
      }
    }

    console.log(this.form.value);
  }

  get branchAddressFormArray(): FormArray {
    return this.form.get('branchAddress') as FormArray;
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

  openUploadDialog() {
    const dialogRef = this.dialog.open(UploaderDialogComponent, { 
      width: '50%', 
      height: '50%',
      data: this.certificatesFormArray.value
    });
    dialogRef.afterClosed().subscribe();
  }

  addCertificate(certificateFile: File) {
    // this.uploaderService.upload(certificateFile).subscribe();


    const certificate = this.fb.group({
      link: ['', [Validators.required]],
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

  addBranchAddress() {
    this.branchAddressFormArray.push(this.fb.control(''));
  }

  /**
  * Render PDF preview on selecting file
  */
  onFileSelected() {
    const pdf: any = document.querySelector('#file');

    if ((typeof FileReader !== 'undefined') && (pdf.files.length !== 0)) {
      this.isLoading = true;

      for (let i = 0; i < pdf.files.length; i++) {
        const reader = new FileReader();

        reader.onloadend = (e: any) => {
          this.addCertificate(pdf.files[i]);
          this.pdfSrc.push(e.target.result);
          this.pdfSrc$.next(this.pdfSrc);
        };

        reader.readAsArrayBuffer(pdf.files[i]);
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
