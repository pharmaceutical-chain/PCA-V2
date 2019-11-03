import { ITenant_CREATE } from './../../shared/utils/tenants.interface';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ITenant_GET } from '../../shared/utils/tenants.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TENANT, SERVER_URL, API } from '../../shared/utils/constants';

@Injectable({
  providedIn: 'root'
})
export class TenantService {

  constructor(private _http: HttpClient, ) { }

  getTenants(): Observable<ITenant_GET[]> {
    const url = SERVER_URL + API + TENANT;
    return this._http.get<ITenant_GET[]>(url);
  }

  createTenant(tenant: ITenant_CREATE) {
    const url = SERVER_URL + API + TENANT;
    return this._http.post(url, tenant);
  }

  deleteTenant(tenantId: string) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json-patch+json'
      }),
      body:  '"' + tenantId + '"'
    }
    const url = SERVER_URL + API + TENANT;
    return this._http.delete(url, options);
  }
}
