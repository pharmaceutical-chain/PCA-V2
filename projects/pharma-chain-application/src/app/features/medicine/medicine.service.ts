import { IMedicine_CREATE, IMedicine_GET, IMedicine_SEARCH } from './../../shared/utils/medicines.interface';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MEDICINE, SERVER_URL, API } from '../../shared/utils/constants';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicineService {

  constructor(private _http: HttpClient, ) { }

  getMedicines(): Observable<IMedicine_GET[]> {
    const url = SERVER_URL + API + MEDICINE;

    return this._http.get(url).pipe(
      map((baseMedicineArray: Object[]) => {
        const convertedArray: IMedicine_GET[] = [];

        baseMedicineArray.forEach(base => {
          const converted: IMedicine_GET = {
            id: base['id'],
            registrationCode: base['registrationCode'],
            commercialName: base['commercialName'],
            ingredientConcentration: base['ingredientConcentration'],
            isPrescriptionMedicine: base['isPrescriptionMedicine'],
            manufacturer: `${base['submittedTenant']['name']} / ${base['submittedTenant']['registrationCode']}`,
            dosageForm: base['dosageForm'],
            packingSpecification: base['packingSpecification'],
            declaredPrice: base['declaredPrice'],
            manufacturerAddress: base['submittedTenant']['primaryAddress'],
            transactionHash: base['transactionHash'],
            contractAddress: base['contractAddress'],
            dateCreated: (new Date(base['dateCreated'])).toLocaleDateString(),
            transactionStatus: base['transactionStatus'],
          };

          convertedArray.push(converted);
        });

        return convertedArray;
      })
    );
  }

  createMedicine(medicine: IMedicine_CREATE) {
    const url = SERVER_URL + API + MEDICINE;
    return this._http.post(url, medicine);
  }

  deleteMedicine(medicineId: string) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json-patch+json'
      }),
      body: '"' + medicineId + '"'
    }
    const url = SERVER_URL + API + MEDICINE;
    return this._http.delete(url, options);
  }

  getMedicinesForSearch(): Observable<IMedicine_SEARCH[]> {
    const url = SERVER_URL + API + MEDICINE;

    return this._http.get(url).pipe(
      map((baseMedicineArray: Object[]) => {
        const convertedArray: IMedicine_SEARCH[] = [];

        baseMedicineArray.forEach(base => {
          const converted: IMedicine_SEARCH = {
            id: base['id'],
            commercialName: base['commercialName'],
            ingredientConcentration: base['ingredientConcentration'],
            packingSpecification: base['packingSpecification']
          };

          convertedArray.push(converted);
        });

        return convertedArray;
      })
    );
  }
}
