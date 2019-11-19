import { ITransfer_SEARCH } from './../../shared/utils/transfer.interface';
import { ITransfer_CREATE, ITransfer_GET } from '../../shared/utils/transfer.interface';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TRANSFER, SERVER_URL, API } from '../../shared/utils/constants';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransferService {

  constructor(private _http: HttpClient, ) { }

  getTransfers(): Observable<ITransfer_GET[]> {
    const url = SERVER_URL + API + TRANSFER;

    return this._http.get(url).pipe(
      map((baseTransferArray: Object[]) => {
        const convertedArray: ITransfer_GET[] = [];

        baseTransferArray.forEach(base => {
          const converted: ITransfer_GET = {
            id: base['id'],
            from: base['from']['name'],
            to: base['to']['name'],
            medicine: base['medicineBatch']['medicine']['commercialName'],
            batchNumber: base['medicineBatch']['batchNumber'],
            quantity: base['quantity'],
            unit: base['medicineBatch']['unit'],

            registrationCode: base['medicineBatch']['medicine']['registrationCode'],
            medicineCA: base['medicineBatch']['medicine']['contractAddress'],
            isPrescriptionMedicine: base['medicineBatch']['medicine']['isPrescriptionMedicine'],
            ingredientConcentration: base['medicineBatch']['medicine']['ingredientConcentration'],
            declaredPrice: base['medicineBatch']['medicine']['declaredPrice'],
            registeredBy: base['medicineBatch']['medicine']['submittedTenant']['name'],
            registeredByCA: base['medicineBatch']['medicine']['submittedTenant']['contractAddress'],

            manufactureDate: (new Date(base['medicineBatch']['manufactureDate'])).toLocaleDateString(),
            expiryDate: (new Date(base['medicineBatch']['expiryDate'])).toLocaleDateString(),
            madeIn: base['medicineBatch']['manufacturer']['primaryAddress'],
            madeBy: base['medicineBatch']['manufacturer']['name'],
            madeByCA: base['medicineBatch']['manufacturer']['contractAddress'],
            batchCA: base['medicineBatch']['contractAddress'],

            fromAddress: base['from']['primaryAddress'],
            fromCA: base['from']['contractAddress'],

            transactionHash: base['transactionHash'],
            contractAddress: base['contractAddress'],
            date: (new Date(base['dateCreated'])).toLocaleDateString(),
            time: (new Date(base['dateCreated'])).toLocaleTimeString(),
            transactionStatus: base['transactionStatus'],
          };

          convertedArray.push(converted);
        });

        return convertedArray;
      })
    );
  }

  createTransfer(transfer: ITransfer_CREATE) {
    const url = SERVER_URL + API + TRANSFER;
    return this._http.post(url, transfer);
  }

  deleteTransfer(transferId: string) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json-patch+json'
      }),
      body: '"' + transferId + '"'
    }
    const url = SERVER_URL + API + TRANSFER;
    return this._http.delete(url, options);
  }

  getTransfersForSearch(): Observable<ITransfer_SEARCH[]> {
    const url = SERVER_URL + API + TRANSFER;

    return this._http.get(url).pipe(
      map((baseTransferArray: Object[]) => {
        const convertedArray: ITransfer_SEARCH[] = [];

        baseTransferArray.forEach(base => {
          const converted: ITransfer_SEARCH = {
            to: base['to']['id'],

            batchId: base['medicineBatch']['id'],
            batchNumber: base['medicineBatch']['batchNumber'],
            manufactureDate: (new Date(base['medicineBatch']['manufactureDate'])).toLocaleDateString(),
            expiryDate: (new Date(base['medicineBatch']['expiryDate'])).toLocaleDateString(),
            quantity: base['quantity'],

            manufacturerId: base['medicineBatch']['manufacturer']['id'],
            manufacturerCode: base['medicineBatch']['manufacturer']['registrationCode'],
            manufacturer: base['medicineBatch']['manufacturer']['name'],

            medicineId: base['medicineBatch']['medicine']['id'],
            medicineCode: base['medicineBatch']['medicine']['registrationCode'],
            commercialName: base['medicineBatch']['medicine']['commercialName'],
            ingredientConcentration: base['medicineBatch']['medicine']['ingredientConcentration'],
          };

          convertedArray.push(converted);
        });

        return convertedArray;
      })
    );
  }
}
