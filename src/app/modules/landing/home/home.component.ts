import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { LandingHomeService } from './home.service';

@Component({
    selector     : 'landing-home',
    templateUrl  : './home.component.html',
    encapsulation: ViewEncapsulation.None
})
export class LandingHomeComponent implements AfterViewInit
{
    @Input() adressType: string;
    @Output() setAddress: EventEmitter<any> = new EventEmitter();
    @ViewChild('addresstext') addresstext: any;
    showBedroomList: boolean = false;
    bedrooms = ['Any','Single Room','Bedsitter','1 Bedroom','2 Bedrooms','3 Bedrooms','4 Bedrooms','5 Bedrooms','6 Bedrooms','7 Bedrooms'];
    results = [];
    selectedBedroom;
    autocompleteInput: string;
    queryWait: boolean;
    location: string;
    minimumPrice = 1000;
    maximumPrice = 100000;
    bathrooms = 1;

    /**
     * Constructor
     */
    constructor(
        private _homeService: LandingHomeService
    )
    {
    }

    ngAfterViewInit() {
        this.getPlaceAutocomplete();
    }
    
    private getPlaceAutocomplete() {
        const autocomplete = new google.maps.places.Autocomplete(this.addresstext.nativeElement,
        {
            componentRestrictions: { country:  'KE' },
            types: ['establishment', 'geocode'] 
        
        });
        google.maps.event.addListener(autocomplete, 'place_changed', () => {
            const place = autocomplete.getPlace();
            console.log(place);
            this.location = place.name
        });
    }

    invokeEvent(place: Object) {
        this.setAddress.emit(place);
    }

    searchProperty() {
        let bedrooms = 0;
        
        const searchParam = {
            location: this.location,
            minPrice: this.minimumPrice,
            maxPrice: this.maximumPrice,
            bedRooms: bedrooms,
            bathRooms: this.bathrooms,
            propertyTypeId: 2
        };
        // const searchParam = new PropertySearchParam(this.location,this.minimumPrice,this.maximumPrice,bedrooms,this.bathrooms,2);
        this._homeService.search(searchParam).subscribe(results => this.results = results);
    }
}
