import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FuseAlertType } from '@fuse/components/alert';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RentalCostDTO } from '../../property/property';
import { PropertyService } from '../../property/property.service';
import { ListingsService } from '../listings.service';

@Component({
  selector: 'listings-rent',
  templateUrl: './listings-rent.component.html',
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListingsRentComponent implements OnInit, OnDestroy
{
  listingId = Number(this._route.snapshot.paramMap.get('listingId'));
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  listing;
  property;
  rentalCost;
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
    this._listingsService.rent$.pipe(takeUntil(this._unsubscribeAll)).subscribe(rent => {
      this.rentalCost = rent;
    });
  }

  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
  }

  onSubmit(form: NgForm): void
  {
    const exactAmount = form.value.exactAmount;
    const minAmount = form.value.minAmount;
    const maxAmount = form.value.maxAmount;

    if (form.valid) {
      const request: RentalCostDTO = new RentalCostDTO(this.rentalCost.id, minAmount, exactAmount, maxAmount, this.listingId);
      this._listingsService.updateRentalCost(request, this.rentalCost.id).subscribe(
        (rentalCostDTO: RentalCostDTO) => {
          this.rentalCost = rentalCostDTO;
          this.alert = {
            type   : 'success',
            message: 'Rent cost updated successfully.'
          };
          this.showAlert = true;
          window.scroll(0,0);
        }
      )
    }
  }
}
