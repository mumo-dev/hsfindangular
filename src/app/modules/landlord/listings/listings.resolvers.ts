import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ListingsService } from './listings.service';

@Injectable({
    providedIn: 'root'
})
export class ListingsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _listingsService: ListingsService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
        let propertyId = Number(route.paramMap.get('propertyId'));
        return this._listingsService.fetchPropertyListings(propertyId);
    }
}

@Injectable({
    providedIn: 'root'
})
export class ListingResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _listingsService: ListingsService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
        let listingId = Number(route.paramMap.get('listingId'));
        return this._listingsService.getListingById(listingId);
    }
}

@Injectable({
    providedIn: 'root'
})
export class ListingPhotosResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _listingsService: ListingsService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
        let listingId = Number(route.paramMap.get('listingId'));
        return this._listingsService.getListingPhotos(listingId);
    }
}

@Injectable({
    providedIn: 'root'
})
export class ExternalFeaturesResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _listingsService: ListingsService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
        let listingId = Number(route.paramMap.get('listingId'));
        return this._listingsService.getListingExternalFeatures(listingId);
    }
}

@Injectable({
    providedIn: 'root'
})
export class InternalFeaturesResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _listingsService: ListingsService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
        let listingId = Number(route.paramMap.get('listingId'));
        return this._listingsService.getListingInternalFeatures(listingId);
    }
}

@Injectable({
    providedIn: 'root'
})
export class RentResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _listingsService: ListingsService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
        let listingId = Number(route.paramMap.get('listingId'));
        return this._listingsService.getListingRentalCost(listingId);
    }
}

@Injectable({
    providedIn: 'root'
})
export class ElectricityCostResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _listingsService: ListingsService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
        let listingId = Number(route.paramMap.get('listingId'));
        return this._listingsService.getListingElectricityCost(listingId);
    }
}

@Injectable({
    providedIn: 'root'
})
export class ElectricityInstallationTypesResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _listingsService: ListingsService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
        return this._listingsService.getElectricityInstallationTypes();
    }
}

@Injectable({
    providedIn: 'root'
})
export class WaterAvailabilityTypesResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _listingsService: ListingsService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
        return this._listingsService.getWaterAvailabilityTypes();
    }
}

@Injectable({
    providedIn: 'root'
})
export class WaterCostResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _listingsService: ListingsService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
        let listingId = Number(route.paramMap.get('listingId'));
        return this._listingsService.getListingWaterCost(listingId);
    }
}

@Injectable({
    providedIn: 'root'
})
export class AdditionalCostsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _listingsService: ListingsService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
        let listingId = Number(route.paramMap.get('listingId'));
        return this._listingsService.getListingAdditionalCosts(listingId);
    }
}
