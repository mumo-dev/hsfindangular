import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AdditionalCostDTO, LocationDTO, PropertyDTO } from './property';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class PropertyService
{
    private _property: BehaviorSubject<any> = new BehaviorSubject(null);
    private _properties: BehaviorSubject<any> = new BehaviorSubject(null);
    private _counties: BehaviorSubject<any> = new BehaviorSubject(null);
    private _location: BehaviorSubject<any> = new BehaviorSubject(null);
    private _photos: BehaviorSubject<any> = new BehaviorSubject(null);
    private _features: BehaviorSubject<any> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for property
    */
     get property$(): Observable<any>
     {
         return this._property.asObservable();
     }
 
    /**
     * Getter for properties
    */
     get properties$(): Observable<any>
     {
         return this._properties.asObservable();
     }
   
     /**
      * Getter for counties
    */
    get counties$(): Observable<any>
    {
        return this._counties.asObservable();
    }
   
    /**
     * Getter for location
     */
    get location$(): Observable<any>
    {
        return this._location.asObservable();
    }
   
    /**
     * Getter for photos
     */
    get photos$(): Observable<any>
    {
        return this._photos.asObservable();
    }
   
    /**
     * Getter for features
     */
    get features$(): Observable<any>
    {
        return this._features.asObservable();
    }
   
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get properties
     *
     * @param email
     */
    getProperties(): Observable<any>
    {
        return this._httpClient.get('/api/v1/property').pipe(
            tap((response: any) => {
                this._properties.next(response);
            }));
    }

    getPropertyStep(propertyId: number): Observable<any> {
        return this._httpClient.get(`/api/v1/property/steps/${propertyId}`);
    }

    getPropertyListingStep(propertyListingId: number): Observable<any> {
        return this._httpClient.get(`/api/v1/propertylisting/steps/${propertyListingId}`);
    }

    getPropertyTypes(): Observable<any> {
        return this._httpClient.get(`/api/v1/property/types`);
    }

    getElectricityInstallationTypes(): Observable<any> {
        return this._httpClient.get(`/api/v1/pricing/electricity/installationtypes`);
    }

    getWaterAvailabilityTypes(): Observable<any> {
        return this._httpClient.get(`/api/v1/pricing/water/availabilitytypes`);
    }

    getCounties(): Observable<any> {
        return this._httpClient.get(`/api/v1/location/counties`).pipe(
            tap((response: any) => {
                this._counties.next(response);
            }));
    }

    fetchPropertyFeatures(): Observable<string[]> {
        return this._httpClient.get<string[]>(`/api/v1/property/generalFeatures`);
    }

    createProperty(request: PropertyDTO): Observable<any> {
        return this._httpClient.post<PropertyDTO>(`/api/v1/property`, request);
    }

    createPropertyFeatures(request: { propertyFeatures: string[]; }, propertyId: number): Observable<any> {
        return this._httpClient.post(`api/v1/property/${propertyId}/features`, request);
    }

    createLocation(request: any): Observable<any> {
        return this._httpClient.post(`/api/v1/property/location`, request);
    }

    uploadPropertyImages(formData: FormData, propertyId: number): Observable<any> {
        return this._httpClient.post(`api/v1/images/upload/property/${propertyId}`, formData);
    }

    createRoomType(request: any): Observable<any> {
      return this._httpClient.post(`/api/v1/roomtypes`, request);
    }

    createPropertyListing(request: any): Observable<any> {
        return this._httpClient.post(`/api/v1/propertylisting`, request);
    }

    createRentalCost(request: any): Observable<any> {
        return this._httpClient.post(`/api/v1/pricing/rent`, request);
    }

    createElectricityCost(request: any): Observable<any> {
        return this._httpClient.post(`/api/v1/pricing/electricity`, request);
    }

    createWaterCost(request: any): Observable<any> {
        return this._httpClient.post(`/api/v1/pricing/water`, request);
    }

    createAdditionalCost(request: AdditionalCostDTO[]): Observable<any> {
        return this._httpClient.post<AdditionalCostDTO[]>(`/api/v1/pricing/additionalcosts`, request);
    }

    getPropertyById(propertyId: number): Observable<PropertyDTO> {
        return this._httpClient.get(`/api/v1/property/${propertyId}`).pipe(
            tap((response: any) => {
                this._property.next(response);
            }));
    }

    getRentalCostByPropertyListingId(propertyListingId: number): Observable<any> {
        return this._httpClient.get(`api/v1/pricing/rent/property/${propertyListingId}`);
    }

    getWaterCostByPropertyListingId(propertyListingId: number): Observable<any> {
        return this._httpClient.get(`api/v1/pricing/water/property/${propertyListingId}`);
    }

    getElectricityCostByPropertyListingId(propertyListingId: number): Observable<any> {
        return this._httpClient.get(`api/v1/pricing/electricity/property/${propertyListingId}`);
    }

    getAdditionalCostByPropertyListingId(propertyListingId: number): Observable<AdditionalCostDTO[]> {
        return this._httpClient.get<AdditionalCostDTO[]>(`api/v1/pricing/additionalcosts/property/${propertyListingId}`);
    }

    getLocation(propertyId: number): Observable<any> {
        return this._httpClient.get(`/api/v1/property/location/${propertyId}`).pipe(
            tap((response: any) => {
                this._location.next(response);
            }));
    }

    getPropertyPhotos(propertyId: number): Observable<string[]> {
        return this._httpClient.get(`/api/v1/images/property/${propertyId}`).pipe(
            tap((response: any) => {
                this._photos.next(response);
            }));
    }

    getFeaturesByPropertyId(propertyId: number): Observable<any> {
        return this._httpClient.get(`api/v1/property/${propertyId}/features`).pipe(
            tap((response: any) => {
                this._features.next(response);
            }));
    }

    updateProperty(request: PropertyDTO, propertyId: number): Observable<PropertyDTO> {
        return this._httpClient.put<PropertyDTO>(`/api/v1/property/${propertyId}`, request);
    }

    updateLocation(request: LocationDTO, locationId: number): Observable<LocationDTO> {
        return this._httpClient.put<LocationDTO>(`/api/v1/property/location/${locationId}`, request);
    }
}
