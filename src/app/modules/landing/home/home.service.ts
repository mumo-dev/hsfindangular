import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LandingHomeService
{

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    search(searchParam: any): Observable<any> {
        return this._httpClient.post(`/api/v1/guest/property/search`, searchParam);
    }
}
