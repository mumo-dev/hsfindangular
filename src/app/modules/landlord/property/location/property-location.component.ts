import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FuseAlertType } from '@fuse/components/alert';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LocationDTO } from '../property';
import { PropertyService } from '../property.service';

@Component({
  selector: 'property-location',
  templateUrl: './property-location.component.html',
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyLocationComponent implements OnInit, OnDestroy
{
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  propertyId = Number(this._route.snapshot.paramMap.get('propertyId'));
  property;
  counties;
  location;
  selectedCountyId;
  latitude: number;
  longitude: number;
  showAlert: boolean = false;
  alert: { type: FuseAlertType; message: string } = {
    type   : 'success',
    message: ''
  };

  constructor(
    private _propertyService: PropertyService,
    private _route: ActivatedRoute,
    private _ref: ChangeDetectorRef ) { }

  ngOnInit(): void {
    this._propertyService.property$.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (property) => { 
        this.property = property;
    });
    this._propertyService.counties$.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (counties) => { 
        this.counties = counties;
    });
    this._propertyService.location$.pipe(takeUntil(this._unsubscribeAll)).subscribe(location => { 
        this.location = location;
        this.selectedCountyId = location.countyId;
        this.latitude = location.latitude;
        this.longitude = location.longitude;
        this.initMap(location.longitude, location.latitude);
      }
    )
  }

  initMap(longitude, latitude) {
    const myLatlng = { lat: parseFloat(latitude), lng: parseFloat(longitude) };
  
    const map = new google.maps.Map(document.getElementById("map")!, {
      zoom: 16,
      center: myLatlng,
    });
    const marker = new google.maps.Marker({
      position: myLatlng,
      map,
      title: this.property.name,
      label: this.property.name,
      animation: google.maps.Animation.BOUNCE,
      draggable: true
    });
    map.addListener("click", (e) => {
      marker.setPosition(e.latLng)
      map.panTo(e.latLng)
      this.latitude = e.latLng.lat()
      this.longitude = e.latLng.lng()
      this._ref.detectChanges();
    });
    google.maps.event.addListener(marker, 'dragend', function() {
      console.log('Bounds changed.');
      const latlng = marker.getPosition().toJSON();
      this.latitude = latlng.lat;
      this.longitude = latlng.lng;
      // Changing values directly since the binding seems not to be working
      (<HTMLInputElement>document.getElementById('lat')).value = this.latitude;
      (<HTMLInputElement>document.getElementById('long')).value = this.longitude;
    });
  }

  cordinateChanged(e) {
    this.initMap(this.longitude, this.latitude)
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

   onSubmit(form: NgForm): void {
    const town = form.value.town;
    const suburb = form.value.suburb;
    const areaName = form.value.areaName;
    const street = form.value.street;
    const additionalInfo = form.value.additionalInfo;
    const longitude = form.value.long;
    const latitude = form.value.lat;

    if (form.valid) {
      const request = new LocationDTO(this.location.locationId, this.selectedCountyId, 
        this.propertyId, null, town, suburb, areaName, additionalInfo, street, this.latitude, this.longitude
      );
      this._propertyService.updateLocation(request, this.location.locationId).subscribe(locationDTO => {
          this.location = locationDTO;
          this.alert = {
            type   : 'success',
            message: 'Property location updated successfully.'
          };
          this.showAlert = true;
          window.scroll(0,0);
      });
    }
  }
}
