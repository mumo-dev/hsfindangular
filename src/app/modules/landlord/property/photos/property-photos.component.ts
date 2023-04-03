import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { ActivatedRoute } from '@angular/router';
import { FuseAlertType } from '@fuse/components/alert';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PropertyService } from '../property.service';

@Component({
  selector: 'property-photos',
  templateUrl: './property-photos.component.html',
  styleUrls: ['./property-photos.component.scss'],
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyPhotosComponent implements OnInit, OnDestroy
{
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  propertyId = Number(this._route.snapshot.paramMap.get('propertyId'));
  @ViewChild(MatAccordion) accordion: MatAccordion;
  property;
  photos: string[];
  newPhotos = [];
  showAlert: boolean = false;
  alert: { type: FuseAlertType; message: string } = {
    type   : 'success',
    message: ''
  };

  constructor(
    private _propertyService: PropertyService,
    private _route: ActivatedRoute ) { }

  ngOnInit(): void {
    this._propertyService.property$.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (property) => { 
        this.property = property;
    });
    this._propertyService.photos$.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (photos) => { 
        this.photos = photos;
    });
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
   onPropertyFileDropped($event): void {
    this.propertyFilesHandler($event);
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
   * Convert Files list to normal array list
   * @param files (Files List)
  */
  preparePropertyFilesList(files: Array<any>): void {
    for (const item of files) {
      item.progress = 0;
      this.newPhotos.push(item);
    }
  }

  deletePropertyPhoto(i): void {
    this.newPhotos.splice(this.newPhotos.indexOf(this.newPhotos[i]), 1);
  }

  onSubmit(form: NgForm): void {
    if (this.newPhotos.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < this.newPhotos.length; i++) {
        formData.append('images', this.newPhotos[i]);
      }
      this._propertyService.uploadPropertyImages(formData, this.propertyId).subscribe(
        (result) => { 
          this.alert = {
            type   : 'success',
            message: 'Property photos successfully.'
          };
          this.showAlert = true;
          this.accordion.closeAll();
          window.scroll(0,0);
          this.newPhotos = [];
          this._propertyService.photos$.pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (photos) => { 
              this.photos = photos;
          });
        }
      );
    }
  }
}
