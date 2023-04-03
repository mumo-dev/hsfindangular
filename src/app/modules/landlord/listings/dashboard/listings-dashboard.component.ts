import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ElectricityCostDTO, WaterCostDTO } from '../../property/property';
import { PropertyService } from '../../property/property.service';
import { ListingsService } from '../listings.service';

@Component({
  selector: 'listings-dashboard',
  templateUrl: './listings-dashboard.component.html',
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListingsDashboardComponent implements OnInit, OnDestroy
{
  listingId = Number(this._route.snapshot.paramMap.get('listingId'));
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  listing;
  externalFeatures;
  internalFeatures;
  rentalCost;
  selectedElectricityInstallationTypeId;
  electricityInstallationTypes;
  electricityCost;
  waterAvailabilityTypes;
  selectedWaterAvailabilityTypeId;
  waterCost;
  additionalCosts;

  constructor(
    private _listingsService: ListingsService,
    private _propertyService: PropertyService,
    private _route: ActivatedRoute) { }

  ngOnInit(): void {
    this._listingsService.listing$.pipe(takeUntil(this._unsubscribeAll)).subscribe(listing => {
      this.listing = listing;
    });
    this._listingsService.externalFeatures$.pipe(takeUntil(this._unsubscribeAll)).subscribe(externalFeatures => {
      this.externalFeatures = externalFeatures;
    });
    this._listingsService.internalFeatures$.pipe(takeUntil(this._unsubscribeAll)).subscribe(internalFeatures => {
      this.internalFeatures = internalFeatures;
    });
    this._listingsService.rent$.pipe(takeUntil(this._unsubscribeAll)).subscribe(rent => {
      this.rentalCost = rent;
    });
    this._listingsService.electricityCost$.pipe(takeUntil(this._unsubscribeAll)).subscribe(electricityCost => {
      this.electricityCost = electricityCost;
      this.selectedElectricityInstallationTypeId = electricityCost.installationTypeId;
    });
    this._listingsService.electricityInstallationTypes$.pipe(takeUntil(this._unsubscribeAll)).subscribe(electricityInstallationTypes => {
      this.electricityInstallationTypes = electricityInstallationTypes;
    });
    this._listingsService.waterAvailabilityTypes$.pipe(takeUntil(this._unsubscribeAll)).subscribe(waterAvailabilityTypes => {
      this.waterAvailabilityTypes = waterAvailabilityTypes;
    });
    this._listingsService.waterCost$.pipe(takeUntil(this._unsubscribeAll)).subscribe(waterCost => {
      this.waterCost = waterCost;
      this.selectedWaterAvailabilityTypeId = waterCost.waterAvailabilityId;
    });
    this._listingsService.additionalCosts$.pipe(takeUntil(this._unsubscribeAll)).subscribe(additionalCosts => {
      this.additionalCosts = additionalCosts;
    });
  }

  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
  }

  onSubmitElectricityCost(form: NgForm): void {
    const fixedAmount = form.value.fixedAmount;

    if (form.valid) {
      if (this.electricityCost === null) {
        this.electricityCost = new ElectricityCostDTO(null, this.listingId, fixedAmount, this.selectedElectricityInstallationTypeId, null);
        this._propertyService.createElectricityCost(this.electricityCost).subscribe(electricityCost => {
            this.electricityCost = electricityCost;
        });
      }
      else {

        this.electricityCost.fixedAmount = fixedAmount;
        this.electricityCost.installationTypeId = this.selectedElectricityInstallationTypeId;
        this._listingsService.updateElectricityCost(this.electricityCost).subscribe(electricityCost => {
            this.electricityCost = electricityCost;
        });
      }
    }
  }

  onSubmitWaterCost(form: NgForm): void {
    const fixedAmount = form.value.fixedAmount;
    const frequencyPerMonth = form.value.frequencyPerMonth;
    const pricePerUnit = form.value.pricePerUnit;
    const unitSizeInLitres = form.value.unitSizeInLitres;

    if (form.valid) {
      if (this.waterCost === null) {

        this.waterCost = new WaterCostDTO(
          null, fixedAmount, unitSizeInLitres, pricePerUnit, frequencyPerMonth, this.listingId, 
          this.selectedWaterAvailabilityTypeId, null);

        this._propertyService.createWaterCost(this.waterCost).subscribe(waterCost => {
            this.waterCost = waterCost;
        });
      }
      else {

      }
    }
  }

}
