import { ITenant_CREATE, ITenant_SEARCH, ITenant_GET } from '../../shared/utils/tenants.interface';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TENANT, SERVER_URL, API } from '../../shared/utils/constants';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TenantService {

  constructor(private _http: HttpClient, ) { }

  getTenants(tenantId?: string): Observable<ITenant_GET[]> {
    let url = SERVER_URL + API + TENANT;
    url = tenantId ? `${url}/${tenantId}` : url;
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
      body: '"' + tenantId + '"'
    }
    const url = SERVER_URL + API + TENANT;
    return this._http.delete(url, options);
  }

  updateTenant(tenantId, tenant: ITenant_CREATE) {
    const url = SERVER_URL + API + TENANT + '/' + tenantId;
    return this._http.put(url, tenant);
  }

  getTenantForSearch(): Observable<ITenant_SEARCH[]> {
    const url = SERVER_URL + API + TENANT;

    return this._http.get(url).pipe(
      map((baseTenantArray: Object[]) => {
        const convertedArray: ITenant_SEARCH[] = [];

        baseTenantArray.forEach(base => {
          const converted: ITenant_SEARCH = {
            id: base['id'],
            name: base['name'],
            registrationCode: base['registrationCode'],
            primaryAddress: base['primaryAddress']
          };

          convertedArray.push(converted);
        });

        return convertedArray;
      })
    );
  }
}
