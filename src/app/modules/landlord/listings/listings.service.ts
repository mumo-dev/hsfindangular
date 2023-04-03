import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ListingsService
{
    private _listings: BehaviorSubject<any> = new BehaviorSubject(null);
    private _listing: BehaviorSubject<any> = new BehaviorSubject(null);
    private _photos: BehaviorSubject<any> = new BehaviorSubject(null);
    private _externalFeatures: BehaviorSubject<any> = new BehaviorSubject(null);
    private _internalFeatures: BehaviorSubject<any> = new BehaviorSubject(null);
    private _rent: BehaviorSubject<any> = new BehaviorSubject(null);
    private _electricityInstallationTypes: BehaviorSubject<any> = new BehaviorSubject(null);
    private _electricityCost: BehaviorSubject<any> = new BehaviorSubject(null);
    private _waterCost: BehaviorSubject<any> = new BehaviorSubject(null);
    private _waterAvailabilityTypes: BehaviorSubject<any> = new BehaviorSubject(null);
    private _additionalCosts: BehaviorSubject<any> = new BehaviorSubject(null);

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
     * Getter for listings
    */
    get listing$(): Observable<any>
    {
        return this._listing.asObservable();
    }
 
    /**
     * Getter for listings
    */
    get listings$(): Observable<any>
    {
        return this._listings.asObservable();
    }
   
    /**
     * Getter for photos
    */
    get photos$(): Observable<any>
    {
        return this._photos.asObservable();
    }
   
    /**
     * Getter for external features
    */
    get externalFeatures$(): Observable<any>
    {
        return this._externalFeatures.asObservable();
    }
   
    /**
     * Getter for internal features
    */
    get internalFeatures$(): Observable<any>
    {
        return this._internalFeatures.asObservable();
    }
   
    /**
     * Getter for rent
    */
    get rent$(): Observable<any>
    {
        return this._rent.asObservable();
    }
   
    /**
     * Getter for electricity installation types
    */
    get electricityInstallationTypes$(): Observable<any>
    {
        return this._electricityInstallationTypes.asObservable();
    }
   
    /**
     * Getter for electricity installation types
    */
    get electricityCost$(): Observable<any>
    {
        return this._electricityCost.asObservable();
    }
   
    /**
     * Getter for water availability types
    */
    get waterAvailabilityTypes$(): Observable<any>
    {
        return this._waterAvailabilityTypes.asObservable();
    }
   
    /**
     * Getter for water cost
    */
    get waterCost$(): Observable<any>
    {
        return this._waterCost.asObservable();
    }
   
    /**
     * Getter for additional costs
    */
    get additionalCosts$(): Observable<any>
    {
        return this._additionalCosts.asObservable();
    }
   
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    createPropertyListingFeatures(request: any, propertyListingId: number, featureType: string): Observable<any> {
      return this._httpClient.post(
        `/api/v1/propertylisting/${propertyListingId}/features`, request, { params: {featureType} }
      );
    }

    uploadPropertyListingImages(formData: FormData, propertyListingId: number): Observable<any> {
        return this._httpClient.post(`api/v1/images/upload/propertylisting/${propertyListingId}`, formData);
    }

    updateRentalCost(request: any, rentalCostId: number): Observable<any> {
        return this._httpClient.put(`/api/v1/pricing/rent/${rentalCostId}`, request);
    }

    updateElectricityCost(request: any): Observable<any> {
        return this._httpClient.put(`/api/v1/pricing/electricity/${request.id}`, request);
    }

    updateWaterCost(request: any): Observable<any> {
        return this._httpClient.put(`/api/v1/pricing/water/${request.id}`, request);
    }

    updatePropertyListing(request: any, id: number): Observable<any> {
        return this._httpClient.put(`/api/v1/propertylisting/${id}`, request);
    }

    getElectricityInstallationTypes(): Observable<any> {
        return this._httpClient.get(`/api/v1/pricing/electricity/installationtypes`).pipe(
            tap((response: any) => {
                this._electricityInstallationTypes.next(response);
            }));
    }

    getWaterAvailabilityTypes(): Observable<any> {
        return this._httpClient.get(`/api/v1/pricing/water/availabilitytypes`).pipe(
            tap((response: any) => {
                this._waterAvailabilityTypes.next(response);
            }));
    }

    fetchPropertyListings(propertyId: number): Observable<any> {
        return this._httpClient.get(`/api/v1/propertylisting/property/${propertyId}`).pipe(
            tap((response: any) => {
                this._listings.next(response);
            }));
    }

    getListingById(listingId: number): Observable<any> {
        return this._httpClient.get(`/api/v1/propertylisting/${listingId}`).pipe(
            tap((response: any) => {
                this._listing.next(response);
            }));
    }

    getListingPhotos(listingId: number): Observable<any> {
        return this._httpClient.get(`/api/v1/images/propertylisting/${listingId}`).pipe(
            tap((response: any) => {
                this._photos.next(response);
            }));
    }

    getListingExternalFeatures(listingId: number): Observable<any> {
        return this._httpClient.get(`/api/v1/propertylisting/${listingId}/features`, { params: { featureType: 'external' }} ).pipe(
            tap((response: any) => {
                this._externalFeatures.next(response);
            }));
    }

    getListingInternalFeatures(listingId: number): Observable<any> {
        return this._httpClient.get(`/api/v1/propertylisting/${listingId}/features`, { params: { featureType: 'internal' }} ).pipe(
            tap((response: any) => {
                this._internalFeatures.next(response);
            }));
    }

    getListingRentalCost(listingId: number): Observable<any> {
        return this._httpClient.get(`/api/v1/pricing/rent/property/${listingId}`).pipe(
            tap((response: any) => {
                this._rent.next(response);
            }));
    }

    getListingElectricityCost(listingId: number): Observable<any> {
        return this._httpClient.get(`/api/v1/pricing/electricity/property/${listingId}`).pipe(
            tap((response: any) => {
                this._electricityCost.next(response);
            }));
    }

    getListingWaterCost(listingId: number): Observable<any> {
        return this._httpClient.get(`/api/v1/pricing/water/property/${listingId}`).pipe(
            tap((response: any) => {
                this._waterCost.next(response);
            }));
    }

    getListingAdditionalCosts(listingId: number): Observable<any> {
        return this._httpClient.get(`/api/v1/pricing/additionalcosts/property/${listingId}`).pipe(
            tap((response: any) => {
                this._additionalCosts.next(response);
            }));
    }

    getRoomType(roomTypeId: number): Observable<any> {
        return this._httpClient.get(`/api/v1/roomtypes/${roomTypeId}`);
    }
}
