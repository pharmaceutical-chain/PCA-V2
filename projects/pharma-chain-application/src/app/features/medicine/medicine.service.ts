import { IMedicine_CREATE } from './../../shared/utils/medicines.interface';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MEDICINE, SERVER_URL, API } from '../../shared/utils/constants';

@Injectable({
  providedIn: 'root'
})
export class MedicineService {

  constructor(private _http: HttpClient, ) { }

  getMedicines() {
    const url = SERVER_URL + API + MEDICINE;
    return this._http.get(url);
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
      body:  '"' + medicineId + '"'
    }
    const url = SERVER_URL + API + MEDICINE;
    return this._http.delete(url, options);
  }
}
