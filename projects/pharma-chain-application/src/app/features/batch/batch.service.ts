import { IBatch_CREATE, IBatch_GET } from './../../shared/utils/batches.interface';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BATCH, SERVER_URL, API } from '../../shared/utils/constants';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BatchService {

  constructor(private _http: HttpClient, ) { }

  getBatches(): Observable<IBatch_GET[]> {
    const url = SERVER_URL + API + BATCH;

    return this._http.get(url).pipe(
      map((baseBatchArray: Object[]) => {
        const convertedArray: IBatch_GET[] = [];

        baseBatchArray.forEach(base => {
          const converted: IBatch_GET = {
            id: base['id'],
            batchNumber: base['batchNumber'],
            commercialName: base['medicine']['commercialName'],
            ingredientConcentration: base['medicine']['ingredientConcentration'],
            manufacturer: `${base['manufacturer']['name']} / ${base['manufacturer']['registrationCode']}`,
            manufactureDate: (new Date(base['manufactureDate'])).toLocaleDateString(),
            expiryDate: (new Date(base['expiryDate'])).toLocaleDateString(),
            quantity: base['quantity'],
            unit: base['unit'],
            transactionHash: base['transactionHash'],
            contractAddress: base['contractAddress'],
            dateCreated: (new Date(base['dateCreated'])).toLocaleDateString(),
            transactionStatus: base['transactionStatus'],
            manufacturerId: base['manufacturer']['id'],
            medicineId: base['medicine']['id'],
          };

          convertedArray.push(converted);
        });

        return convertedArray;
      })
    );
  }

  createBatch(batch: IBatch_CREATE) {
    const url = SERVER_URL + API + BATCH;
    return this._http.post(url, batch);
  }

  deleteBatch(batchId: string) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json-patch+json'
      }),
      body: '"' + batchId + '"'
    }
    const url = SERVER_URL + API + BATCH;
    return this._http.delete(url, options);
  }
}
