import { IBatch_CREATE, IBatch_GET, IBatch_SEARCH } from './../../shared/utils/batches.interface';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BATCH, SERVER_URL, API } from '../../shared/utils/constants';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UtilsService } from '../../shared/utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class BatchService {

  constructor(private _http: HttpClient,
    private utilsService: UtilsService) { }

  getBatches(): Observable<IBatch_GET[]> {
    const url = SERVER_URL + API + BATCH;
    return this._http.get(url).pipe(
      map((baseBatchArray: Object[]) => {
        const convertedArray: IBatch_GET[] = [];
        baseBatchArray.forEach(base => {
          const dateCreated = this.utilsService.convertToLocalDate(new Date(base['dateCreated']));
          const mfg = this.utilsService.convertToLocalDate(new Date(base['manufactureDate']));
          const exp = this.utilsService.convertToLocalDate(new Date(base['expiryDate']));
          const converted: IBatch_GET = {
            id: base['id'],
            batchNumber: base['batchNumber'],
            medicineId: base['medicine']['id'],
            commercialName: base['medicine']['commercialName'],
            ingredientConcentration: base['medicine']['ingredientConcentration'],
            manufacturerId: base['manufacturer']['id'],
            manufacturer: base['manufacturer']['name'],
            manufactureDate: mfg.toLocaleDateString(),
            expiryDate: exp.toLocaleDateString(),
            quantity: base['quantity'],
            unit: base['unit'],
            certificates: base['certificates'],
            transactionHash: base['transactionHash'],
            contractAddress: base['contractAddress'],
            dateCreated: dateCreated.toLocaleDateString(),
            transactionStatus: base['transactionStatus'],
          };
          convertedArray.push(converted);
        });
        return convertedArray;
      })
    );
  }

  getBatch(batchId: string): Observable<IBatch_GET> {
    const url = SERVER_URL + API + BATCH + `/${batchId}`;
    return this._http.get(url).pipe(
      map((base: Object) => {
        const dateCreated = this.utilsService.convertToLocalDate(new Date(base['dateCreated']));
        const mfg = this.utilsService.convertToLocalDate(new Date(base['manufactureDate']));
        const exp = this.utilsService.convertToLocalDate(new Date(base['expiryDate']));
        const converted: IBatch_GET = {
          id: base['id'],
          batchNumber: base['batchNumber'],
          medicineId: base['medicine']['id'],
          commercialName: base['medicine']['commercialName'],
          ingredientConcentration: base['medicine']['ingredientConcentration'],
          manufacturerId: base['manufacturer']['id'],
          manufacturer: base['manufacturer']['name'],
          manufactureDate: mfg.toLocaleDateString(),
          expiryDate: exp.toLocaleDateString(),
          quantity: base['quantity'],
          unit: base['unit'],
          certificates: base['certificates'],
          transactionHash: base['transactionHash'],
          contractAddress: base['contractAddress'],
          dateCreated: dateCreated.toLocaleDateString(),
          transactionStatus: base['transactionStatus'],
        };
        return converted;
      })
    );
  }

  createBatch(batch: IBatch_CREATE) {
    const url = SERVER_URL + API + BATCH;
    return this._http.post(url, batch);
  }

  updateBatch(batchId: string, batch: IBatch_CREATE) {
    const url = SERVER_URL + API + BATCH + `/${batchId}`;
    return this._http.put(url, batch);
  }

  deleteBatch(batchId: string) {
    const url = SERVER_URL + API + BATCH + `/${batchId}`;
    return this._http.delete(url);
  }

  getBatchesForSearch(): Observable<IBatch_SEARCH[]> {
    const url = SERVER_URL + API + BATCH;
    return this._http.get(url).pipe(
      map((baseBatchArray: Object[]) => {
        const convertedArray: IBatch_SEARCH[] = [];
        baseBatchArray.forEach(base => {
          const mfg = this.utilsService.convertToLocalDate(new Date(base['manufactureDate']));
          const exp = this.utilsService.convertToLocalDate(new Date(base['expiryDate']));
          const converted: IBatch_SEARCH = {
            batchId: base['id'],
            batchNumber: base['batchNumber'],
            manufactureDate: mfg.toLocaleDateString(),
            expiryDate: exp.toLocaleDateString(),
            quantity: base['quantity'],
            unit: base['unit'],
            manufacturerId: base['manufacturer']['id'],
            manufacturerCode: base['manufacturer']['registrationCode'],
            manufacturer: base['manufacturer']['name'],
            medicineId: base['medicine']['id'],
            medicineCode: base['medicine']['registrationCode'],
            commercialName: base['medicine']['commercialName'],
            ingredientConcentration: base['medicine']['ingredientConcentration'],
          };
          convertedArray.push(converted);
        });
        return convertedArray;
      })
    );
  }
}
