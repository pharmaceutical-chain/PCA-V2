
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpRequest,
  HttpEventType,
  HttpResponse
} from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { SERVER_URL, API, UPLOAD_TENANT_CERT } from '../../shared/utils/constants';
import { ICertificate } from '../../shared/utils/certificates.interface';

@Injectable({
  providedIn: 'root'
})
export class UploaderService {
  constructor(private http: HttpClient) { }

  public upload(certificates: Set<ICertificate>): { [key: string]: { progress: Observable<number> } } {
    const url = SERVER_URL + API + UPLOAD_TENANT_CERT;

    // this will be the our resulting map
    const status: { [key: string]: { progress: Observable<number>, idfile?: Observable<string> } } = {};

    certificates.forEach(certificate => {
      // create a new multipart-form for every file
      const formData: FormData = new FormData();
      formData.append('myFile', certificate.file, certificate.name + '.pdf');

      // create a http-post request and pass the form
      // tell it to report the upload progress
      const req = new HttpRequest('POST', url, formData, {
        reportProgress: true
      });

      // create a new progress-subject for every file
      const progress = new Subject<number>();

      // idfile of uploaded file
      const idfile = new Subject<string>();

      // send the http-request and subscribe for progress-updates
      this.http.request(req).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          // calculate the progress percentage

          const percentDone = Math.round((100 * event.loaded) / event.total);
          // pass the percentage into the progress-stream
          progress.next(percentDone);
        } else if (event.type === HttpEventType.Response) {
          // Close the progress-stream if we get an answer form the API
          // The upload is complete
          progress.complete();
          
          const locationToArray = event.headers.get('location').split('/');
          idfile.next(locationToArray[locationToArray.length - 1]);
          idfile.complete();
        }
      });

      // Save every progress-observable in a map of all observables
      status[certificate.name] = {
        progress: progress.asObservable(),
        idfile: idfile.asObservable()
      };
    });

    // return the map of progress.observables
    return status;
  }
}
