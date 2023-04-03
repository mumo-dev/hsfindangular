import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { PropertyService } from '../property.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'property-list',
  templateUrl: './property-list.component.html',
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyListComponent implements OnInit, OnDestroy {
    properties;
    propertiesColumns: string[] = ['property','status','edit'];
    
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
      private _propertyService: PropertyService,
      private _router: Router ) { }

    ngOnInit(): void {

        // Get the data
        this._propertyService.properties$.pipe(takeUntil(this._unsubscribeAll)).subscribe(properties => {

            // Store the data
            this.properties = properties;
        });
    }

    /**
     * On destroy
     */
     ngOnDestroy(): void
     {
         // Unsubscribe from all subscriptions
         this._unsubscribeAll.next();
         this._unsubscribeAll.complete();
     }
 
 
     // -----------------------------------------------------------------------------------------------------
     // @ Public methods
     // -----------------------------------------------------------------------------------------------------
 
     /**
      * Track by function for ngFor loops
      *
      * @param index
      * @param item
      */
     trackByFn(index: number, item: any): any
     {
         return item.id || index;
     }
 
    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    viewProperty(propertyId): void {
      this._propertyService.getPropertyStep(propertyId).subscribe(
        propertyStep => {
          if (propertyStep.hasPublishedPropertyListing) {
            this._router.navigate(['/p', propertyId]);
          } else {
            this._router.navigate(['/p/add', { id: propertyId }])
          }
        }
      )
    }
}
