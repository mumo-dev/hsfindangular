import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ListingsService } from '../../listings/listings.service';
import { PropertyDTO } from '../property';
import { PropertyService } from '../property.service';

@Component({
  selector: 'property-dashboard',
  templateUrl: './property-dashboard.component.html',
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyDashboardComponent implements OnInit, OnDestroy
{
  propertyId = Number(this._route.snapshot.paramMap.get('propertyId'));
  listingsColumns: string[] = ['name','totalUnits','availableUnits'];
  listings;
  property;
  features;
  
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _propertyService: PropertyService,
    private _listingsService: ListingsService,
    private _route: ActivatedRoute ) { }

  ngOnInit(): void {
    // Get the data
    this._listingsService.listings$.pipe(takeUntil(this._unsubscribeAll)).subscribe(listings => {
        this.listings = listings;
    });
    this._propertyService.property$.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (property: PropertyDTO) => { this.property = property; }
    );
    this._propertyService.features$.pipe(takeUntil(this._unsubscribeAll)).subscribe(features => { this.features = features; });
  }

  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
  }

  getRoomType(roomTypeId: number) {
    let roomTypeDTO;
    this._listingsService.getRoomType(roomTypeId).subscribe(
      (roomType) => { roomTypeDTO = roomType; }
    );
    return roomTypeDTO;
  }
}
