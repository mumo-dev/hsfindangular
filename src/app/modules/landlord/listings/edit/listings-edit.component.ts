import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FuseAlertType } from '@fuse/components/alert';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RoomTypeDTO, PropertyListingDTO } from '../../property/property';
import { PropertyService } from '../../property/property.service';
import { ListingsService } from '../listings.service';

@Component({
  selector: 'listings-edit',
  templateUrl: './listings-edit.component.html',
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListingsEditComponent implements OnInit, OnDestroy 
{
  listingId = Number(this._route.snapshot.paramMap.get('listingId'));
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  listing;
  property;
  externalFeatures;
  internalFeatures;
  showAlert: boolean = false;
  alert: { type: FuseAlertType; message: string } = {
    type   : 'success',
    message: ''
  };

  constructor(
    private _listingsService: ListingsService,
    private _propertyService: PropertyService,
    private _ref: ChangeDetectorRef,
    private _route: ActivatedRoute ) { }

  ngOnInit(): void {
    this._listingsService.listing$.pipe(takeUntil(this._unsubscribeAll)).subscribe(listing => {
      this.listing = listing;
      this._propertyService.getPropertyById(listing.propertyId).subscribe(property => { 
        this.property = property;
        this._ref.detectChanges();
      });
    });
    this._listingsService.getListingExternalFeatures(this.listingId).subscribe(features => {
      this.externalFeatures = features;
    });
    this._listingsService.getListingInternalFeatures(this.listingId).subscribe(features => {
      this.internalFeatures = features;
    });
  }

  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
  }

  onSubmit(form: NgForm): void {
    const totalUnits = form.value.totalUnits;
    const unitsAvailable = form.value.unitsAvailable;
    const description = form.value.description;
    const bathRooms = form.value.bathrooms;
    const kitchens = form.value.kitchens;

    if (form.valid) {
      const roomTypeDTO = new RoomTypeDTO(this.listing.roomTypeDTO.id, this.listing.roomTypeDTO.name, 
        bathRooms, this.listing.roomTypeDTO.bedRooms, kitchens);

      const request = new PropertyListingDTO(
        this.listing.propertyListingId, null, totalUnits, unitsAvailable, description, 
        this.listing.propertyId, roomTypeDTO.id, roomTypeDTO, this.listing.published,
        this.listing.acceptsPayment
      );

      this._listingsService.updatePropertyListing(request, this.listingId).subscribe(listingDTO => {
        this.listing = listingDTO;
        this.alert = {
          type   : 'success',
          message: 'Property details updated successfully.'
        };
        this.showAlert = true;
        window.scroll(0,0);
      });
    }
  }
}
