import { UtilsService } from './../../shared/utils/utils.service';
import { ITransfer_CREATE, ITransfer_GET, ITransfer_SEARCH } from '../../shared/utils/transfer.interface';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TRANSFER, SERVER_URL, API } from '../../shared/utils/constants';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransferService {

  constructor(private _http: HttpClient,
    private utilsService: UtilsService) { }

  getTransfers(): Observable<ITransfer_GET[]> {
    const url = SERVER_URL + API + TRANSFER;

    return this._http.get(url).pipe(
      map((baseTransferArray: Object[]) => {
        const convertedArray: ITransfer_GET[] = [];

        baseTransferArray.forEach(base => {
          const dateCreated = this.utilsService.convertToLocalDate(new Date(base['dateCreated']));
          const mfg = this.utilsService.convertToLocalDate(new Date(base['medicineBatch']['manufactureDate']));
          const exp = this.utilsService.convertToLocalDate(new Date(base['medicineBatch']['expiryDate']));

          const converted: ITransfer_GET = {
            id: base['id'],
            from: base['from']['name'],
            fromId: base['from']['id'],
            to: base['to']['name'],
            toId: base['to']['id'],
            medicine: base['medicineBatch']['medicine']['commercialName'],
            batchNumber: base['medicineBatch']['batchNumber'],
            quantity: base['quantity'],
            unit: base['medicineBatch']['unit'],
            isConfirmed: base['isConfirmed'],
            medicineBatchId: base['medicineBatch']['id'],

            registrationCode: base['medicineBatch']['medicine']['registrationCode'],
            medicineCA: base['medicineBatch']['medicine']['contractAddress'],
            declaredPrice: base['medicineBatch']['medicine']['declaredPrice'],
            registeredBy: base['medicineBatch']['medicine']['submittedTenant']['name'],
            registeredByCA: base['medicineBatch']['medicine']['submittedTenant']['contractAddress'],

            manufactureDate: mfg.toLocaleDateString(),
            expiryDate: exp.toLocaleDateString(),
            madeIn: base['medicineBatch']['manufacturer']['primaryAddress'],
            madeBy: base['medicineBatch']['manufacturer']['name'],
            madeByCA: base['medicineBatch']['manufacturer']['contractAddress'],
            batchCA: base['medicineBatch']['contractAddress'],

            fromAddress: base['from']['primaryAddress'],
            fromCA: base['from']['contractAddress'],

            toAddress: base['to']['primaryAddress'],
            toCA: base['to']['contractAddress'],

            transactionHash: base['transactionHash'],
            contractAddress: base['contractAddress'],
            date: dateCreated.toLocaleDateString(),
            time: dateCreated.toLocaleTimeString(),
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
            unit: base['medicineBatch']['unit'],

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

  updateTransfer(id: string, transfer: ITransfer_CREATE) {
    const url = SERVER_URL + API + TRANSFER + `/${id}`;
    return this._http.put(url, transfer);
  }
}
