import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FuseAlertType } from '@fuse/components/alert';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PropertyDTO, PropertyTypeDTO } from '../property';
import { PropertyService } from '../property.service';

@Component({
  selector: 'property-edit',
  templateUrl: './property-edit.component.html',
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyEditComponent implements OnInit, OnDestroy
{
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  propertyId = Number(this._route.snapshot.paramMap.get('propertyId'));
  property;
  selectedPropertyTypeId;
  propertyTypes: PropertyTypeDTO[];
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
        this.selectedPropertyTypeId = property.propertyTypeId;
    });
    this._propertyService.getPropertyTypes().subscribe(
      (propertyTypes: PropertyTypeDTO[]) => { this.propertyTypes = propertyTypes; }
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

  onSubmit(form: NgForm): void {
    const name = form.value.name;
    const description = form.value.description;

    if (form.valid) {
      const request = new PropertyDTO(
        this.property.id, this.selectedPropertyTypeId, null, name, description, this.property.active, this.property.propertyTypeDTO);

      this._propertyService.updateProperty(request,this.propertyId).subscribe(property => {
        this.property = property;
        this.alert = {
            type   : 'success',
            message: 'Property details updated successfully.'
        };
        this.showAlert = true;
      });
    }
  }
}
