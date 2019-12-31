import { ICertificate } from './../../../shared/utils/certificates.interface';
import { Router, ActivatedRoute } from '@angular/router';
import { TenantService } from './../tenant.service';
import { PdfViewerComponent } from './../../../shared/pdf-viewer/pdf-viewer.component';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
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
    goodPractices: [{ value: '', disabled: true }],
    certificatesArray: this.fb.array([])
  });
  certificates = '';
  initCertificatesArray;
  needUpload: boolean;
  canUpdate = true;
  initialFormValue: object;

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
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(async res => {
      this.tenantId = res['tenantId'];
      if (this.tenantId) {
        this.tenant = await this.tenantService.getTenants(this.tenantId).toPromise();
        if (this.tenant) {
          const certArr: Array<string> = this.tenant['certificates'] ? this.tenant['certificates'].split(',').map(c => c.substring(0, c.length - 41)) : [];
          this.form.patchValue({
            name: this.tenant['name'],
            email: this.tenant['email'],
            taxCode: this.tenant['taxCode'],
            registrationCode: this.tenant['registrationCode'],
            type: this.tenant['type'],
            phoneNumber: this.tenant['phoneNumber'],
            primaryAddress: this.tenant['primaryAddress'],
            goodPractices: certArr.toString(),
          });
          this.certificates = this.tenant['certificates'];
          certArr.forEach(cert => {
            this.addCertificate({ name: cert });
            this.pdfSrc = this.tenant['certificates'].split(',').map(c => `https://lamle.blob.core.windows.net/tenant-certificates/${c}`)
          });
          this.initCertificatesArray = this.certificatesFormArray.value;
          this.pdfSrc$.next(this.pdfSrc);
          this.initialFormValue = this.form.value;
          this.canUpdate = false;
          this.form.valueChanges.subscribe(value => {
            if (JSON.stringify(value) !== JSON.stringify(this.initialFormValue)) {
              this.canUpdate = true;
            } else {
              this.canUpdate = false;
            }
          });
        }
      }
    });

    this.certificatesFormArray.valueChanges.subscribe(value => {
      this.form.get('goodPractices').setValue(this.certificateNames);
      if (value.length === 0) {
        this.needUpload = false;
      }
    });
  }

  submit() {
    if (this.form.valid) {
      if (this.tenantId) {
        this.tenantService.updateTenant(this.tenantId, { ...this.form.value, certificates: this.certificates ? this.certificates : '' }).subscribe(res => {
          this.notificationService.success('Update tenant successfully!');
          setTimeout(() => {
            this.router.navigate(['/tenant/overview-tenant']).then(() => {
              setTimeout(() => {
                this.notificationService.info('We are mining into blockchain...');
              }, 1000);
            });
          }, 1000);
        });
      } else {
        this.tenantService.createTenant({ ...this.form.value, certificates: this.certificates }).subscribe(res => {
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
  }

  get branchAddressFormArray(): FormArray {
    return this.form.get('branchAddress') as FormArray;
  }

  get certificatesFormArray(): FormArray {
    return this.form.get('certificatesArray') as FormArray;
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
      data: this.certificatesFormArray.value.filter(c => c['idfile'] === '')
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res && res['message'] === 'success') {
        const certIds = res['data'].map((c: ICertificate) => c.idfile);
        this.certificates === '' ? this.certificates += certIds.toString() : this.certificates += ',' + certIds.toString();
        this.needUpload = false;
        this.cdr.markForCheck();
        this.certificatesFormArray.disable();
        this.initCertificatesArray = this.certificatesFormArray.value;
      }
    });
  }

  addCertificate(cert: { name?: string, file?: File }) {
    const certificate = this.fb.group({
      idfile: [cert.name ? cert.name : ''],
      name: [{ value: cert.name ? cert.name : '', disabled: cert.name ? true : false }, [Validators.required]],
      file: [cert.file]
    });
    if (cert.file !== undefined) {
      this.needUpload = true;
    }
    this.certificatesFormArray.push(certificate);
  }

  removeCertificate(index: number) {
    this.certificatesFormArray.removeAt(index);
    this.pdfSrc.splice(index, 1);
    this.pdfSrc$.next(this.pdfSrc);

    if (!this.needUpload) {
      const certificates = this.certificates.split(',');
      certificates.splice(index, 1);
      this.certificates = certificates.toString();
      if (JSON.stringify(this.initCertificatesArray) === JSON.stringify(this.certificatesFormArray.value)) {
        this.canUpdate = false;
      } else {
        this.canUpdate = true;
      }
    }
    if (JSON.stringify(this.initCertificatesArray) === JSON.stringify(this.certificatesFormArray.value)) {
      this.needUpload = false;
    } else {
      this.needUpload = false;
      for (const cert of this.certificatesFormArray.value) {
        if (cert['file'] !== null) {
          this.needUpload = true;
        }
      }
    }
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
          this.addCertificate({ file: pdf.files[i] });
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
