import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { PropertyService } from './property.service';

@Injectable({
    providedIn: 'root'
})
export class PropertiesResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _propertyService: PropertyService)
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
        return this._propertyService.getProperties();
    }
}

@Injectable({
    providedIn: 'root'
})
export class PropertyResolver implements Resolve<any>
{
    /**
     * Constructor
     */
     constructor(private _propertyService: PropertyService)
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
        return this._propertyService.getPropertyById(propertyId);
    }
}

@Injectable({
    providedIn: 'root'
})
export class CountiesResolver implements Resolve<any>
{
    /**
     * Constructor
     */
     constructor(private _propertyService: PropertyService)
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
        return this._propertyService.getCounties();
    }
}

@Injectable({
    providedIn: 'root'
})
export class LocationResolver implements Resolve<any>
{
    /**
     * Constructor
     */
     constructor(private _propertyService: PropertyService)
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
        return this._propertyService.getLocation(propertyId);
    }
}

@Injectable({
    providedIn: 'root'
})
export class PropertyPhotosResolver implements Resolve<any>
{
    /**
     * Constructor
     */
     constructor(private _propertyService: PropertyService)
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
        return this._propertyService.getPropertyPhotos(propertyId);
    }
}

@Injectable({
    providedIn: 'root'
})
export class PropertyFeaturesResolver implements Resolve<any>
{
    /**
     * Constructor
     */
     constructor(private _propertyService: PropertyService)
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
        return this._propertyService.getFeaturesByPropertyId(propertyId);
    }
}
