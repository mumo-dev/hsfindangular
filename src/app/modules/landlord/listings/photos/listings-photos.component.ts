import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { ActivatedRoute } from '@angular/router';
import { FuseAlertType } from '@fuse/components/alert';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PropertyService } from '../../property/property.service';
import { ListingsService } from '../listings.service';

@Component({
  selector: 'listings-photos',
  templateUrl: './listings-photos.component.html',
  styleUrls: ['./listings-photos.component.scss'],
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListingsPhotosComponent implements OnInit, OnDestroy
{
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  listingId = Number(this._route.snapshot.paramMap.get('listingId'));
  @ViewChild(MatAccordion) accordion: MatAccordion;
  listing;
  property;
  photos: string[];
  newPhotos = [];
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
    this._listingsService.getListingPhotos(this.listingId).subscribe(
      (photos) => { this.photos = photos; }
    )
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
      this.newPhotos.push(item);
    }
  }

  deletePhoto(i): void {
    this.newPhotos.splice(this.newPhotos.indexOf(this.newPhotos[i]), 1);
  }

  onSubmit(form: NgForm): void {
    if (this.newPhotos.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < this.newPhotos.length; i++) {
        formData.append('images', this.newPhotos[i]);
      }
      this._listingsService.uploadPropertyListingImages(formData, this.listingId).subscribe(
        (result) => { 
          this.alert = {
            type   : 'success',
            message: 'Property photos successfully.'
          };
          this.showAlert = true;
          this.accordion.closeAll();
          window.scroll(0,0);
          this.newPhotos = [];
          this._listingsService.photos$.pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (photos) => { 
              this.photos = photos;
          });
        }
      );
    }
  }
}
