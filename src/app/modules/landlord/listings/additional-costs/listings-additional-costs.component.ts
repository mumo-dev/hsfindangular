import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FuseAlertType } from '@fuse/components/alert';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AdditionalCostDTO } from '../../property/property';
import { PropertyService } from '../../property/property.service';
import { ListingsService } from '../listings.service';

@Component({
  selector: 'listings-additional-costs',
  templateUrl: './listings-additional-costs.component.html',
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListingsAdditionalCostsComponent implements OnInit, OnDestroy
{
  listingId = Number(this._route.snapshot.paramMap.get('listingId'));
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  listing;
  property;
  additionalCosts = [''];
  alert: { type: FuseAlertType; message: string } = {
      type   : 'success',
      message: ''
  };
  showAlert: boolean = false;

  constructor(
    private _listingsService: ListingsService,
    private _propertyService: PropertyService,
    private _ref: ChangeDetectorRef,
    private _route: ActivatedRoute) { }

  ngOnInit(): void {
    this._listingsService.listing$.pipe(takeUntil(this._unsubscribeAll)).subscribe(listing => {
      this.listing = listing;
      this._propertyService.getPropertyById(listing.propertyId).subscribe(property => { 
        this.property = property;
        this._ref.detectChanges();
      });
    });
    this._listingsService.additionalCosts$.pipe(takeUntil(this._unsubscribeAll)).subscribe(additionalCosts => {
      if (additionalCosts.length > 0) {
        this.additionalCosts = [];
        this.additionalCosts.push(...additionalCosts);
      }
    });
  }

  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
  }

  addAdditionalCost(): void {
    if (this.additionalCosts.length < 10) {
      this.additionalCosts.push('');
    }
  }

  onSubmit(form: NgForm): void {
    let extraCosts: AdditionalCostDTO[] = [];
    if (form.valid) {
      for ( let i = 0; i < this.additionalCosts.length; i++ ) {
        const formItem = 'item_' + i;
        const formAmount = 'amount_' + i;
        const formAmountIsApproximate = 'amountIsApproximate_' + i;
        const formDescription = 'description_' + i;
        const item = form.value[formItem];
        const amount = form.value[formAmount];
        const amountIsApproximate = form.value[formAmountIsApproximate];
        const description = form.value[formDescription];

        const additionalCost = new AdditionalCostDTO(null, item, amount, amountIsApproximate, description, this.listingId);
        extraCosts.push(additionalCost);
      }
      this._propertyService.createAdditionalCost(extraCosts).subscribe(additionalCostDTOs => {
          this.additionalCosts = [];
          this.additionalCosts.push(additionalCostDTOs);
        }
      )
    }
  }
}
