import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatSliderModule, MatProgressBarModule, MatDialogModule, MatExpansionModule, MatPaginatorModule, MatBadgeModule, MatAutocompleteModule, MatTableModule, MatSortModule } from '@angular/material/';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
  faBars,
  faUserCircle,
  faPowerOff,
  faCog,
  faPlayCircle,
  faRocket,
  faPlus,
  faEdit,
  faTrash,
  faTimes,
  faCaretUp,
  faCaretDown,
  faExclamationTriangle,
  faFilter,
  faTasks,
  faCheck,
  faSquare,
  faLanguage,
  faPaintBrush,
  faLightbulb,
  faWindowMaximize,
  faStream,
  faBook,
  faAngleDoubleRight,
  faSearch,
  faExternalLinkAlt,
  faMinus,
  faMapMarker,
  faEnvelope,
  faBell,
  faTachometerAlt,
  faClinicMedical,
  faCapsules,
  faSwatchbook,
  faChartLine,
  faExchangeAlt
} from '@fortawesome/free-solid-svg-icons';
import {
  faGithub,
  faMediumM,
  faBehanceSquare,
  faTwitter
} from '@fortawesome/free-brands-svg-icons';

import { BigInputComponent } from './big-input/big-input/big-input.component';
import { BigInputActionComponent } from './big-input/big-input-action/big-input-action.component';
import { RtlSupportDirective } from './rtl-support/rtl-support.directive';

import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PdfViewerComponent } from './pdf-viewer/pdf-viewer.component';
import { ImageViewerComponent } from './image-viewer/image-viewer.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { HttpLoaderComponent } from './http-loader/http-loader.component';
import { MaterialElevationDirective } from './elevation-hover/material-elevation.directive';
import { UploaderDialogComponent } from './uploader-dialog/uploader-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    TranslateModule,

    MatButtonModule,
    MatToolbarModule,
    MatSelectModule,
    MatTabsModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatCardModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatDialogModule,
    MatProgressBarModule,

    FontAwesomeModule,
    PdfViewerModule
  ],
  declarations: [
    BigInputComponent,
    BigInputActionComponent,
    RtlSupportDirective,
    PdfViewerComponent,
    ImageViewerComponent,
    ConfirmationDialogComponent,
    HttpLoaderComponent,
    MaterialElevationDirective,
    UploaderDialogComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    TranslateModule,

    MatButtonModule,
    MatMenuModule,
    MatTabsModule,
    MatChipsModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatCardModule,
    MatSidenavModule,
    MatListModule,
    MatSelectModule,
    MatToolbarModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatSliderModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatBadgeModule,
    MatAutocompleteModule,
    MatTableModule,
    MatSortModule,

    FontAwesomeModule,

    BigInputComponent,
    BigInputActionComponent,
    RtlSupportDirective,
    ConfirmationDialogComponent,
    HttpLoaderComponent,
    MaterialElevationDirective
  ],
  entryComponents: [
    PdfViewerComponent,
    ImageViewerComponent,
    ConfirmationDialogComponent,
    UploaderDialogComponent
  ]
})
export class SharedModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faBars,
      faUserCircle,
      faPowerOff,
      faCog,
      faRocket,
      faPlayCircle,
      faGithub,
      faMediumM,
      faBehanceSquare,
      faTwitter,
      faPlus,
      faEdit,
      faTrash,
      faTimes,
      faCaretUp,
      faCaretDown,
      faExclamationTriangle,
      faFilter,
      faTasks,
      faCheck,
      faSquare,
      faLanguage,
      faPaintBrush,
      faLightbulb,
      faWindowMaximize,
      faStream,
      faBook,
      faAngleDoubleRight,
      faSearch,
      faExternalLinkAlt,
      faMinus,
      faMapMarker,
      faEnvelope,
      faBell,
      faTachometerAlt,
      faClinicMedical,
      faCapsules,
      faSwatchbook,
      faExchangeAlt,
      faChartLine
    );
  }
}
