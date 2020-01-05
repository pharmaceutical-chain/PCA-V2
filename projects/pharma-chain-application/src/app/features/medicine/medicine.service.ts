import { IMedicine_CREATE, IMedicine_GET, IMedicine_SEARCH } from './../../shared/utils/medicines.interface';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MEDICINE, SERVER_URL, API } from '../../shared/utils/constants';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UtilsService } from '../../shared/utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class MedicineService {

  constructor(private _http: HttpClient,
    private utilsService: UtilsService) { }

  getMedicines(): Observable<IMedicine_GET[]> {
    const url = SERVER_URL + API + MEDICINE;
    return this._http.get(url).pipe(
      map((baseMedicineArray: Object[]) => {
        const convertedArray: IMedicine_GET[] = [];

        baseMedicineArray.forEach(base => {
          const dateCreated = this.utilsService.convertToLocalDate(new Date(base['dateCreated']));

          const converted: IMedicine_GET = {
            id: base['id'],
            registrationCode: base['registrationCode'],
            commercialName: base['commercialName'],
            ingredientConcentration: base['ingredientConcentration'],
            isPrescriptionMedicine: base['isPrescriptionMedicine'],
            manufacturerId: base['submittedTenant']['id'],
            manufacturer: base['submittedTenant']['name'],
            dosageForm: base['dosageForm'],
            packingSpecification: base['packingSpecification'],
            declaredPrice: base['declaredPrice'],
            manufacturerAddress: base['submittedTenant']['primaryAddress'],
            certificates: base['certificates'],
            isApprovedByAdmin: base['isApprovedByAdmin'],
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

  getMedicine(medicineId: string): Observable<IMedicine_GET> {
    const url = SERVER_URL + API + MEDICINE + `/${medicineId}`;
    return this._http.get(url).pipe(
      map((base: Object) => {
        const dateCreated = this.utilsService.convertToLocalDate(new Date(base['dateCreated']));
        const converted: IMedicine_GET = {
          id: base['id'],
          registrationCode: base['registrationCode'],
          commercialName: base['commercialName'],
          ingredientConcentration: base['ingredientConcentration'],
          isPrescriptionMedicine: base['isPrescriptionMedicine'],
          manufacturerId: base['submittedTenant']['id'],
          manufacturer: base['submittedTenant']['name'],
          dosageForm: base['dosageForm'],
          packingSpecification: base['packingSpecification'],
          declaredPrice: base['declaredPrice'],
          manufacturerAddress: base['submittedTenant']['primaryAddress'],
          certificates: base['certificates'],
          isApprovedByAdmin: base['isApprovedByAdmin'],
          transactionHash: base['transactionHash'],
          contractAddress: base['contractAddress'],
          dateCreated: dateCreated.toLocaleDateString(),
          transactionStatus: base['transactionStatus'],
        };
        return converted;
      })
    );
  }

  createMedicine(medicine: IMedicine_CREATE) {
    const url = SERVER_URL + API + MEDICINE;
    return this._http.post(url, medicine);
  }

  updateMedicine(medicineId, medicine: IMedicine_CREATE) {
    const url = SERVER_URL + API + MEDICINE + `/${medicineId}`;
    return this._http.put(url, medicine);
  }

  deleteMedicine(medicineId: string) {
    const url = SERVER_URL + API + MEDICINE + `/${medicineId}`;
    return this._http.delete(url);
  }

  getMedicinesForSearch(): Observable<IMedicine_SEARCH[]> {
    const url = SERVER_URL + API + MEDICINE;

    return this._http.get(url).pipe(
      map((baseMedicineArray: Object[]) => {
        const convertedArray: IMedicine_SEARCH[] = [];
        baseMedicineArray.forEach(base => {
          const converted: IMedicine_SEARCH = {
            id: base['id'],
            registrationCode: base['registrationCode'],
            commercialName: base['commercialName'],
            ingredientConcentration: base['ingredientConcentration'],
            packingSpecification: base['packingSpecification'],
            isApprovedByAdmin: base['isApprovedByAdmin'],
          };
          convertedArray.push(converted);
        });
        return convertedArray;
      })
    );
  }
}
