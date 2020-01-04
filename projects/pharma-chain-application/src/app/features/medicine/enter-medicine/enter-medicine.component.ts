import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ROUTE_ANIMATIONS_ELEMENTS, NotificationService } from '../../../core/core.module';
import { Observable, BehaviorSubject } from 'rxjs';
import { Validators, FormBuilder, FormArray } from '@angular/forms';
import { PDFDocumentProxy, PDFProgressData } from 'pdfjs-dist';
import { MatDialog } from '@angular/material';
import { startWith, map } from 'rxjs/operators';
import { PdfViewerComponent } from '../../../shared/pdf-viewer/pdf-viewer.component';
import { MedicineService } from '../medicine.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IMedicine_CREATE, IMedicine_GET } from '../../../shared/utils/medicines.interface';
import { UploaderDialogComponent } from '../../../shared/uploader-dialog/uploader-dialog.component';
import { ICertificate } from '../../../shared/utils/certificates.interface';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'pca-enter-medicine',
  templateUrl: './enter-medicine.component.html',
  styleUrls: ['./enter-medicine.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnterMedicineComponent implements OnInit {

  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  medicineId: string;

  dosageFormOptions = ['Viên nén (Tablet)', 'Viên nang (Capsule)', 'Dược phẩm dạng bột (Powder)', 'Viên sủi (Effervescent tablet)', 'Dung dịch (Solution)', 'Thuốc tiêm (Injection)'];
  filteredOptions: Observable<string[]>;

  form = this.fb.group({
    registrationCode: ['', [Validators.required]],
    commercialName: ['', [Validators.required]],
    isPrescriptionMedicine: [true],
    dosageForm: ['', [Validators.required]],
    ingredientConcentration: ['', [Validators.required]],
    packingSpecification: ['', [Validators.required]],
    declaredPrice: ['', [Validators.required]],
    censorshipCertificateNames: [{ value: '', disabled: true }],
    certificatesArray: this.fb.array([])
  });

  certificates = '';
  initCertificatesArray;
  needUpload: boolean;
  canUpdate = true;
  initialFormValue: object;

  pdfSrc: Array<any> = [];
  pdfSrc$ = new BehaviorSubject<any>(this.pdfSrc);
  pdf: Array<PDFDocumentProxy> = [];
  isLoading = false; // presented all pdf on view
  currentPageRendered = [];
  error: Array<any> = [];
  progressData: PDFProgressData;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private medicineService: MedicineService,
    private readonly notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
  ) {
  }

  async ngOnInit() {
    this.route.params.subscribe(async res => {
      this.medicineId = res['medicineId'];
      if (this.medicineId) {
        const medicine = await this.medicineService.getMedicine(this.medicineId).toPromise();
        if (medicine) {
          const certArr: Array<string> = medicine['certificates'] ? medicine['certificates'].split(',').map(c => c.substring(0, c.length - 41)) : [];
          this.form.patchValue({
            registrationCode: medicine['registrationCode'],
            commercialName: medicine['commercialName'],
            isPrescriptionMedicine: medicine['isPrescriptionMedicine'],
            dosageForm: medicine['dosageForm'],
            ingredientConcentration: medicine['ingredientConcentration'],
            packingSpecification: medicine['packingSpecification'],
            declaredPrice: medicine['declaredPrice'],
            censorshipCertificateNames: certArr.toString(),
          });
          this.certificates = medicine['certificates'];
          certArr.forEach(cert => {
            this.addCertificate({ name: cert });
            this.pdfSrc = medicine['certificates'].split(',').map(c => `https://lamle.blob.core.windows.net/tenant-certificates/${c}`)
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
      this.form.get('censorshipCertificateNames').setValue(this.certificateNames);
      if (value.length === 0) {
        this.needUpload = false;
      }
    });

    this.filteredOptions = this.form.get('dosageForm').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.dosageFormOptions.filter(option => option.toLowerCase().includes(filterValue));
  }

  async submit() {
    if (this.form.valid) {
      const tenantId = (await this.authService.getUser$().toPromise()).sub.slice(6);
      const medicine: IMedicine_CREATE = { ...this.form.value, currentlyLoggedInTenant: tenantId, certificates: this.certificates, isApprovedByAdmin: false };
      if (this.medicineId) {
        this.medicineService.updateMedicine(this.medicineId, medicine).subscribe(() => {
          this.notificationService.success('Update medicine successfully!');
          setTimeout(() => {
            this.router.navigate(['/medicine/overview-medicine']).then(() => {
              setTimeout(() => {
                this.notificationService.warn('Waiting for admin approve...');
              }, 1000);
            });
          }, 1000);
        });
      } else {
        this.medicineService.createMedicine(medicine).subscribe(res => {
          if (res) {
            this.notificationService.success('Enter medicine successfully!');
            setTimeout(() => {
              this.router.navigate(['/medicine/overview-medicine']).then(() => {
                setTimeout(() => {
                  this.notificationService.warn('Waiting for admin approve...');
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
      this.cdr.markForCheck();
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
    const $pdf: any = document.querySelector('#file');

    if ((typeof FileReader !== 'undefined') && ($pdf.files.length !== 0)) {
      this.isLoading = true;

      for (let i = 0; i < $pdf.files.length; i++) {
        const reader = new FileReader();

        reader.onloadend = (e: any) => {
          this.addCertificate({ file: $pdf.files[i] });
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
