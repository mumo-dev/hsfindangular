import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseAlertType } from '@fuse/components/alert';
import { Subject } from 'rxjs';
import { AdditionalCostDTO, ElectricityCostDTO, PropertyListingDTO, RentalCostDTO, RoomTypeDTO, WaterCostDTO } from '../../property/property';
import { PropertyService } from '../../property/property.service';
import { ListingsService } from '../listings.service';

@Component({
  selector: 'listings-add',
  templateUrl: './listings-add.component.html',
  styleUrls: ['./listings-add.component.scss'],
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListingsAddComponent implements OnInit, OnDestroy 
{
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  @ViewChild('stepper') private stepper: MatStepper;
  propertyId = Number(this._route.snapshot.paramMap.get('propertyId'));
  showAlert: boolean = false;
  selectedBedrooms: boolean = false;
  exactRentCost: boolean;
  hasAdditionalCosts: boolean;
  roomTypeDTO;
  listing;
  photos = [];
  extraCosts = [];
  selectedElectricityInstallationTypeId;
  selectedWaterAvailabilityTypeId;
  alert: { type: FuseAlertType; message: string } = {
    type   : 'success',
    message: ''
  };

  constructor(
    private _listingsService: ListingsService,
    private _propertyService: PropertyService,
    private _route: ActivatedRoute,
    private _router: Router ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
  }

  /**
   * on file drop handler
  */
   onFileDropped($event): void {
    this.filesHandler($event);
  }

  filesHandler(files): void {
    this.prepareFilesList(files);

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.readAsDataURL(files[i]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        files[i].readImage = event.target.result;
      };
    }
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
  */
  prepareFilesList(files: Array<any>): void {
    for (const item of files) {
      item.progress = 0;
      this.photos.push(item);
    }
  }

  deletePhoto(i): void {
    this.photos.splice(this.photos.indexOf(this.photos[i]), 1);
  }

  saveRoomType(roomType: string): void {
    let name: string, bedrooms: number, kitchens: number, bathrooms: number;
    if (roomType === 'single') {
      name = 'Single Room'; bedrooms = 1; bathrooms = 0; kitchens = 0;
      this.roomTypeDTO = new RoomTypeDTO(null, name, bathrooms, bedrooms, kitchens);
    } else if (roomType === 'bedsitter') {
      name = 'Bedsitter'; bedrooms = 1; bathrooms = 1; kitchens = 0;
      this.roomTypeDTO = new RoomTypeDTO(null, name, bathrooms, bedrooms, kitchens);
    }
    this._propertyService.createRoomType(this.roomTypeDTO).subscribe(
      (roomTypeDTO: RoomTypeDTO) => {
        this.roomTypeDTO = roomTypeDTO;
        this.stepper.next();
    });
  }

  onSubmitBedroomedDetails(form: NgForm): void {
    const bathRooms = form.value.bathrooms;
    const kitchens = form.value.kitchens;
    const bedRooms = form.value.bedrooms;
    const name = bathRooms + ' bedroom';

    if (form.valid) {
      this.roomTypeDTO = new RoomTypeDTO(null, name, bathRooms, bedRooms, kitchens);
      this.saveRoomType('bedroomed');
    }
  }

  onSubmitListingDetails(form: NgForm): void {
    const totalUnits = form.value.totalUnits;
    const unitsAvailable = form.value.unitsAvailable;
    const description = form.value.description;

    if (form.valid) {
      const request: PropertyListingDTO = new PropertyListingDTO(
        null, null, totalUnits, unitsAvailable, description, this.propertyId, this.roomTypeDTO.id,
        this.roomTypeDTO, false, false
      );
      this._propertyService.createPropertyListing(request).subscribe( propertyListingDTO => {
          this.listing = propertyListingDTO;
        }
      )
    }
  }

  onSubmitListingFeatures(form: NgForm): void {
    const externalFeatures = form.value.externalFeatures.split(',');
    const internalFeatures = form.value.internalFeatures.split(',');
    if (externalFeatures.length > 0) {
      const featureType = 'external';
      const request: { listingFeatures: string[] } = { listingFeatures: externalFeatures };
      this._listingsService.createPropertyListingFeatures(request, this.listing.propertyListingId, featureType).subscribe();
    }
    if (internalFeatures.length > 0) {
      const featureType = 'internal';
      const request: { listingFeatures: string[] } = { listingFeatures: internalFeatures };
      this._listingsService.createPropertyListingFeatures(request, this.listing.propertyListingId, featureType).subscribe();
    }
  }

  onSubmitListingPhotos(form: NgForm): void {
    const formData = new FormData();
    for (let i = 0; i < this.photos.length; i++) {
      formData.append('images', this.photos[i]);
    }
    this._listingsService.uploadPropertyListingImages(formData, this.listing.propertyListingId).subscribe();
  }

  onSubmitRentPrice(form: NgForm): void {
    const exactAmount = form.value.exactAmount;
    const minAmount = form.value.minAmount;
    const maxAmount = form.value.maxAmount;

    if (form.valid) {
      const request: RentalCostDTO = new RentalCostDTO(null, minAmount, exactAmount, maxAmount, this.listing.propertyListingId);
      this._propertyService.createRentalCost(request).subscribe();
      this._router.navigateByUrl(`/l/${this.propertyId}`)
    }
  }
}
