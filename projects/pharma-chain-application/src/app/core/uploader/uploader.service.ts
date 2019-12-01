import { SERVER_URL, API } from './../../shared/utils/constants';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpClient, HttpEvent, HttpEventType, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { map, tap, last, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { UPLOAD_TENANT_CERT } from '../../shared/utils/constants';

@Injectable({
  providedIn: 'root'
})
export class UploaderService {

  constructor(private http: HttpClient) { }

  public upload(file: File) {
    const url = SERVER_URL + API + UPLOAD_TENANT_CERT;

    // create a new multipart-form for every file
    const formData: FormData = new FormData();
    formData.append(file.name, file, file.name);
    const req = new HttpRequest('POST', url, formData, {
      reportProgress: true,
    });

    // The `HttpClient.request` API produces a raw event stream
    // which includes start (sent), progress, and response events.
    return this.http.request(req).pipe(
      map(event => this.getEventMessage(event, file)),
      tap(message => this.showProgress(message)),
      last(), // return last (completed) message to caller
      catchError(error => this.handleError(error, file))
    );
  }

  /** Return distinct message for sent, upload progress, & response events */
  private getEventMessage(event: HttpEvent<any>, file: File) {
    switch (event.type) {
      case HttpEventType.Sent:
        return `Uploading file "${file.name}" of size ${file.size}.`;

      case HttpEventType.UploadProgress:
        // Compute and show the % done:
        const percentDone = Math.round(100 * event.loaded / event.total);
        return `File "${file.name}" is ${percentDone}% uploaded.`;

      case HttpEventType.Response:
        return `File "${file.name}" was completely uploaded!`;

      default:
        return `File "${file.name}" surprising upload event: ${event.type}.`;
    }
  }

  private showProgress(message: string) {
    console.log(message);
  }

  private handleError(error: HttpErrorResponse, file: File) {
    console.log(`File "${file.name}" upload error!!!`);
    console.log(error);

    return throwError(
      'Something bad happened; please try again later.');
  };
}
