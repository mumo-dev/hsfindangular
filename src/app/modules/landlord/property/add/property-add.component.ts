import { Component, ViewEncapsulation, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ListingsService } from '../../listings/listings.service';
import { 
  AdditionalCostDTO, ElectricityCostDTO, LocationDTO, PropertyDTO, PropertyListingDTO, RentalCostDTO, RoomTypeDTO, WaterCostDTO
} from '../property';
import { PropertyService } from '../property.service';

@Component({
  selector: 'property-add',
  templateUrl: './property-add.component.html',
  styleUrls: ['./property-add.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class PropertyAddComponent implements OnInit {
  selectedBedrooms: boolean = false;
  propertyTypes;
  electricityInstallationTypes;
  waterAvailabilityTypes;
  features: string[] = [];
  propertyFeatures: string[] = [];
  customFeature: string;
  counties;
  propertyId = this._activatedRoute.snapshot.params.id;
  listingId = this._activatedRoute.snapshot.params.listingId;
  propertyDTO;
  roomTypeDTO;
  propertyListingDTO;
  rentalCostDTO;
  waterCostDTO;
  electricityCostDTO;
  additionalCostDTOs;
  lPhotos = [];
  pPhotos = [];
  photo;
  extraCosts = [''];
  initialCosts = [''];
  selectedPropertyTypeId: number;
  selectedCountyId: number;
  selectedElectricityInstallationTypeId: number;
  selectedWaterAvailabilityTypeId: number;
  longitude: number = 36.80805353512552;
  latitude: number = -1.273359846020901;
  exactRentCost: boolean;
  hasAdditionalCosts: boolean;
  closeResult = '';
  showLeft: boolean;
  showRight: boolean;
  
  alert: { type: FuseAlertType; message: string } = {
      type   : 'success',
      message: ''
  };
  showAlert: boolean = false;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _propertyService: PropertyService,
    private _listingsService: ListingsService,
    private _ref: ChangeDetectorRef,
    private _modalService: NgbModal,
    private _router: Router
  ) { }

  ngOnInit(): void {
    if (this.listingId) {
      this.getPropertyListingStep();
      this._listingsService.getListingById(this.listingId).subscribe((listingDTO) => this.propertyListingDTO = listingDTO);
    }
    else if (this.propertyId) {
      this.getProperyStep();
      this._propertyService.getPropertyById(this.propertyId).subscribe(propertyDTO => {
        this.propertyDTO = propertyDTO
        this.initMap(this.longitude, this.latitude, propertyDTO);
      });
    }
    else document.getElementById('propertyDetail').hidden = false;

    this.getInitialData();
  }

  getInitialData() {
    this._propertyService.getPropertyTypes().subscribe(propertyTypes => {
        this.propertyTypes = propertyTypes;
    });
    this._propertyService.getCounties().subscribe(counties => {
        this.counties = counties;
    });
    this._propertyService.fetchPropertyFeatures().subscribe(
      (features: string[]) => {
        this.features = features;
    });
    this._propertyService.getElectricityInstallationTypes().subscribe(electricityInstallationTypes => {
        this.electricityInstallationTypes = electricityInstallationTypes;
    });
    this._propertyService.getWaterAvailabilityTypes().subscribe(waterAvailabilityTypes => {
        this.waterAvailabilityTypes = waterAvailabilityTypes;
    });
  }

  getPropertyListingStep() {
    this._propertyService.getPropertyListingStep(this.listingId).subscribe(propertyListingStep => {

        if (propertyListingStep.publish) { this._router.navigate([`/p/${this.propertyId}/listings`]) }
        else if (!propertyListingStep.propertyListingExternal || !propertyListingStep.propertyListingInternal) {
          document.getElementById('listingFeatures').hidden = false;
        } 
        else if (!propertyListingStep.images) document.getElementById('listingPhotos').hidden = false;
        else if (!propertyListingStep.rentalCost) document.getElementById('rentPrice').hidden = false;
        else if (!propertyListingStep.electricityCost) document.getElementById('electricityCost').hidden = false;
        else if (!propertyListingStep.waterCost) document.getElementById('waterCost').hidden = false;
        else if (!propertyListingStep.additionalCost) document.getElementById('additionalCost').hidden = false;
        else if (!propertyListingStep.depositPayment) document.getElementById('bookingCosts').hidden = false;
      }
    )
  }

  getProperyStep() {
    this._propertyService.getPropertyStep(this.propertyId).subscribe(propertyStep => {

        if (!propertyStep.propertyFeatures) document.getElementById('generalFeatures').hidden = false;
        else if (!propertyStep.location) document.getElementById('propertyLocation').hidden = false;
        else if (!propertyStep.images) document.getElementById('propertyPhotos').hidden = false;
        else if (!propertyStep.hasPublishedPropertyListing) {
          this._listingsService.fetchPropertyListings(this.propertyId).subscribe(
            propertyListings => {
              if (propertyListings.length > 1) { this._router.navigate([`/p/${this.propertyId}/listings`]) }
              else if (propertyListings.length === 1) {
                this.listingId = propertyListings[0].propertyListingId;
                this._router.navigate(['p/add', { id: this.propertyId, listingId: this.listingId }])
              } else {
                document.getElementById('roomType').hidden = false;
              }
            }
          )
        }
      }
    )
  }

  getGeoLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position)=>{
        this.longitude = position.coords.longitude;
        this.latitude = position.coords.latitude;
        this.initMap(this.longitude, this.latitude, this.propertyDTO);
      }, (error) => {
        console.log(error)
      });
    } else {
      console.log("No support for geolocation")
    }
  }

  initMap(longitude, latitude, propertyDTO) {
    const myLatlng = { lat: parseFloat(latitude), lng: parseFloat(longitude) };
  
    const map = new google.maps.Map(document.getElementById("map")!, {
      zoom: 16,
      center: myLatlng,
    });
    const marker = new google.maps.Marker({
      position: myLatlng,
      map,
      title: propertyDTO.name,
      label: propertyDTO.name,
      animation: google.maps.Animation.BOUNCE,
      draggable: true
    });
    map.addListener("click", (e) => {
      marker.setPosition(e.latLng);
      map.panTo(e.latLng);
      this.latitude = e.latLng.lat();
      this.longitude = e.latLng.lng();
      this._ref.detectChanges();
    });
  
    google.maps.event.addListener(marker, 'dragend', function() {
      const latlng = marker.getPosition().toJSON();
      this.latitude = latlng.lat;
      this.longitude = latlng.lng;
      // Changing values directly since the binding seems not to be working
      (<HTMLInputElement>document.getElementById('lat')).value = this.latitude;
      (<HTMLInputElement>document.getElementById('long')).value = this.longitude;
    });
  }

  cordinateChanged(e: any) {
    this.initMap(this.longitude, this.latitude, this.propertyDTO)
  }

  updateCheckedGeneralFeatures(feature: any): void {
    if (this.propertyFeatures.includes(feature, 0)) {
      const index = this.propertyFeatures.indexOf(feature);
      this.propertyFeatures.splice(index, 1);
    } else { 
      this.propertyFeatures.push(feature);
    }
  }

  addGeneralFeature(): void {
    if (this.customFeature !== '' && this.customFeature != undefined) {
      this.features.push(this.customFeature);
      this._ref.detectChanges()
      this.customFeature = '';
    }
  }

  /**
   * on file drop handler
   */
  onPropertyFileDropped($event): void {
    this.propertyFilesHandler($event);
  }

  onListingFileDropped($event): void {
    this.listingFilesHandler($event);
  }

  /**
   * handle file from browsing
   */
  listingFilesHandler(files): void {
    this.prepareListingFilesList(files);
    
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.readAsDataURL(files[i]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        files[i].readImage = event.target.result;
      };
    }
  }

  propertyFilesHandler(files): void {
    this.preparePropertyFilesList(files);

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.readAsDataURL(files[i]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        files[i].readImage = event.target.result;
      };
    }
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteListingPhoto(i): void {
    if (i !== 'Declared') {
      this.photo = this.lPhotos[i];
    }
    this.lPhotos.splice(this.lPhotos.indexOf(this.photo), 1);
  }

  deletePropertyPhoto(i): void {
    if (i !== 'Declared') {
      this.photo = this.pPhotos[i];
    }
    this.pPhotos.splice(this.pPhotos.indexOf(this.photo), 1);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  preparePropertyFilesList(files: Array<any>): void {
    for (const item of files) {
      item.progress = 0;
      this.pPhotos.push(item);
    }
  }

  prepareListingFilesList(files: Array<any>): void {
    for (const item of files) {
      item.progress = 0;
      this.lPhotos.push(item);
    }
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes, decimals): string {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  openPropertyPhoto(modal, index) {
    this.photo = this.pPhotos[index];
    if (index === 0) {
      this.showLeft = false;
      if (index === this.pPhotos.length -1) { this.showRight = false; }
      else { this.showRight = true; }

    } else if (index === this.pPhotos.length -1) {
      this.showRight = false;
      this.showLeft = true;
    } else {
      this.showLeft = true;
      this.showRight = true;
    }

    this._modalService.open(modal, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openListingPhoto(modal, index) {
    this.photo = this.lPhotos[index];
    if (index === 0) {
      this.showLeft = false;
      if (index === this.lPhotos.length -1) { this.showRight = false; }
      else { this.showRight = true; }

    } else if (index === this.lPhotos.length -1) {
      this.showRight = false;
      this.showLeft = true;
    } else {
      this.showLeft = true;
      this.showRight = true;
    }

    this._modalService.open(modal, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  showPropertyPreviousPhoto(): void {
    const i = this.pPhotos.indexOf(this.photo) - 1;
    this.photo = this.pPhotos[i];
    if (i === 0) {
      this.showLeft = false;
      this.showRight = true;
    } else if (i === this.pPhotos.length) {
      this.showRight = false;
      this.showLeft = true;
    } else {
      this.showLeft = true;
      this.showRight = true;
    }
  }

  showPropertyNextPhoto(): void {
    const i = this.pPhotos.indexOf(this.photo) + 1;
    this.photo = this.pPhotos[i];
    if (i === 0) {
      this.showLeft = false;
      this.showRight = true;
    } else if (i === this.pPhotos.length -1) {
      this.showRight = false;
      this.showLeft = true;
    } else {
      this.showLeft = true;
      this.showRight = true;
    }
  }
  
  showListingPreviousPhoto(): void {
    const i = this.lPhotos.indexOf(this.photo) - 1;
    this.photo = this.lPhotos[i];
    if (i === 0) {
      this.showLeft = false;
      this.showRight = true;
    } else if (i === this.lPhotos.length) {
      this.showRight = false;
      this.showLeft = true;
    } else {
      this.showLeft = true;
      this.showRight = true;
    }
  }

  showListingNextPhoto(): void {
    const i = this.lPhotos.indexOf(this.photo) + 1;
    this.photo = this.lPhotos[i];
    if (i === 0) {
      this.showLeft = false;
      this.showRight = true;
    } else if (i === this.lPhotos.length -1) {
      this.showRight = false;
      this.showLeft = true;
    } else {
      this.showLeft = true;
      this.showRight = true;
    }
  }

  selectedWaterAvailabilityTypeChanged(): void {
    if (this.selectedWaterAvailabilityTypeId == 2) {
      document.getElementById('waterFrequency').hidden = false;
    } else {
      document.getElementById('waterFrequency').hidden = true;
    }
  }

  addAdditionalCost(): void {
    if (this.extraCosts.length < 10) {
      this.extraCosts.push('');
    }
  }

  showHideElement(elToShowId: string, elToHideId: string): void {
    document.getElementById(elToHideId).hidden = true;
    document.getElementById(elToShowId).hidden = false;
  }

  onSubmitPropertyDetail(form: NgForm): void {
    const name = form.value.name;
    const description = form.value.description;
    const active = false;

    if (form.valid) {
      const request = new PropertyDTO(null, this.selectedPropertyTypeId, null, name, description, active, null);
      this._propertyService.createProperty(request).subscribe(property => {
        this.propertyDTO = property;
          this.showHideElement('generalFeatures','propertyDetail');
        this._router.navigate(['p/add', { id: property.id }])
      });
    }
  }

  onSubmitFeatures(form: NgForm): void {
    const request: { propertyFeatures: string[] } = { propertyFeatures: this.propertyFeatures };
    console.log(1);
    this._propertyService.createPropertyFeatures(request, this.propertyId).subscribe(() => {
      console.log(2);
      this.showHideElement('propertyLocation','generalFeatures');
    });
  }

  onSubmitPropertyLocation(form: NgForm): void {
    const town = form.value.town;
    const suburb = form.value.suburb;
    const areaName = form.value.areaName;
    const street = form.value.street;
    const additionalInfo = form.value.additionalInfo;

    if (form.valid) {
      const request = new LocationDTO(null, this.selectedCountyId, this.propertyDTO.id, null, town, 
        suburb, areaName, additionalInfo, street, this.longitude, this.latitude
      );

      this._propertyService.createLocation(request).subscribe(
        (locationDTO: LocationDTO) => {
          this.showHideElement('propertyPhotos', 'propertyLocation');
        }
      )
    }
  }

  onSubmitPropertyPhotos(form: NgForm): void {
    const formData = new FormData();
    for (let i = 0; i < this.pPhotos.length; i++) {
      formData.append('images', this.pPhotos[i]);
    }
    this._propertyService.uploadPropertyImages(formData, this.propertyDTO.id).subscribe();
    this.showHideElement('roomType', 'propertyPhotos');
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
        this.showHideElement('listingDetails','roomType');
      }
    )
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
        null, null, totalUnits, unitsAvailable, description, this.propertyDTO.id, this.roomTypeDTO.id,
        this.roomTypeDTO, false, false
      );
      this._propertyService.createPropertyListing(request).subscribe( propertyListingDTO => {
          this.propertyListingDTO = propertyListingDTO;
          this._router.navigate(['landlord/property', { id: this.propertyDTO.id, listingId: this.propertyListingDTO.propertyListingId }]);
          this.showHideElement('listingFeatures','listingDetails');
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
      this._listingsService.createPropertyListingFeatures(request, this.propertyListingDTO.propertyListingId, featureType).subscribe();
    }
    if (internalFeatures.length > 0) {
      const featureType = 'internal';
      const request: { listingFeatures: string[] } = { listingFeatures: internalFeatures };
      this._listingsService.createPropertyListingFeatures(request, this.propertyListingDTO.propertyListingId, featureType).subscribe();
    }
    this.showHideElement('listingPhotos','listingFeatures');
  }

  onSubmitListingPhotos(form: NgForm): void {
    const formData = new FormData();
    for (let i = 0; i < this.lPhotos.length; i++) {
      formData.append('images', this.lPhotos[i]);
    }
    this._listingsService.uploadPropertyListingImages(formData, this.propertyListingDTO.propertyListingId).subscribe();
    this.showHideElement('rentPrice','listingPhotos');
  }

  onSubmitRentPrice(form: NgForm): void {
    const exactAmount = form.value.exactAmount;
    const minAmount = form.value.minAmount;
    const maxAmount = form.value.maxAmount;

    if (form.valid) {
      const request: RentalCostDTO = new RentalCostDTO(null, minAmount, exactAmount, maxAmount, this.propertyListingDTO.propertyListingId);
      this._propertyService.createRentalCost(request).subscribe(
        (rentalCostDTO: RentalCostDTO) => {
          this.rentalCostDTO = rentalCostDTO;
          this.showHideElement('electricityCost','rentPrice');
        }
      )
    }
  }

  onSubmitElectricityCost(form: NgForm): void {
    const fixedAmount = form.value.fixedAmount;

    if (form.valid) {
      const request = new ElectricityCostDTO(null, this.propertyListingDTO.propertyListingId, fixedAmount, this.selectedElectricityInstallationTypeId, null);
      this._propertyService.createElectricityCost(request).subscribe(
        (electricityCostDTO: ElectricityCostDTO) => {
          this.electricityCostDTO = electricityCostDTO;
          this.showHideElement('waterCost','electricityCost');
        }
      )
    }
  }

  onSubmitWaterCost(form: NgForm): void {
    const fixedAmount = form.value.fixedAmount;
    const frequencyPerMonth = form.value.frequencyPerMonth;
    const pricePerUnit = form.value.pricePerUnit;
    const unitSizeInLitres = form.value.unitSizeInLitres;

    if (form.valid) {
      const request: WaterCostDTO = new WaterCostDTO(
        null, fixedAmount, unitSizeInLitres, pricePerUnit, frequencyPerMonth, this.propertyListingDTO.propertyListingId, 
        this.selectedWaterAvailabilityTypeId, null);

      this._propertyService.createWaterCost(request).subscribe(
        (waterCostDTO: WaterCostDTO) => {
          this.waterCostDTO = waterCostDTO;
          this.showHideElement('additionalCost','waterCost');
        }
      )
    }
  }

  onSubmitAdditionalCost(form: NgForm): void {
    let additionalCosts: AdditionalCostDTO[] = [];
    if (form.valid) {
      for ( let i = 0; i < this.extraCosts.length; i++ ) {
        const formItem = 'item_' + i;
        const formAmount = 'amount_' + i;
        const formAmountIsApproximate = 'amountIsApproximate_' + i;
        const formDescription = 'description_' + i;
        const item = form.value[formItem];
        const amount = form.value[formAmount];
        const amountIsApproximate = form.value[formAmountIsApproximate];
        const description = form.value[formDescription];

        const additionalCost = new AdditionalCostDTO(null, item, amount, amountIsApproximate, description, this.propertyListingDTO.propertyListingId);
        additionalCosts.push(additionalCost);
      }
      this._propertyService.createAdditionalCost(additionalCosts).subscribe(additionalCostDTOs => {
          this.additionalCostDTOs = additionalCostDTOs;
          this.showHideElement('bookingCosts','additionalCost');
        }
      )
    }
  }

  onSubmitBooking(form: NgForm): void {
    const canReceivePayment = form.value.canReceivePayment;

    if (form.valid) {

      if (canReceivePayment === 'true') {
        this._propertyService.getRentalCostByPropertyListingId(this.propertyListingDTO.propertyId).subscribe(
          (rentalCost: RentalCostDTO) => { this.rentalCostDTO = rentalCost; }
        )
        this._propertyService.getWaterCostByPropertyListingId(this.propertyListingDTO.propertyId).subscribe(
          (waterCost) => { this.waterCostDTO = waterCost; }
        )
        this._propertyService.getElectricityCostByPropertyListingId(this.propertyListingDTO.propertyId).subscribe(
          (electricityCostDTO) => { this.electricityCostDTO = electricityCostDTO; }
        )
        this._propertyService.getAdditionalCostByPropertyListingId(this.propertyListingDTO.propertyId).subscribe(
          (additionalCostDTOs) => { this.additionalCostDTOs = additionalCostDTOs; }
        )
      } else {
        this.propertyListingDTO.published = true;
        this.propertyListingDTO.roomTypeId = this.propertyListingDTO.roomTypeDTO.id

        this._listingsService.updatePropertyListing(this.propertyListingDTO, this.propertyListingDTO.propertyListingId).subscribe(
          propertyListingDTO => this.propertyListingDTO = propertyListingDTO
        );
      }
      this.showHideElement('done','booking');
    }
  }

  onSubmitBookingCosts(form: NgForm): void {
    this.showHideElement('booking','bookingCosts');
  }
}
