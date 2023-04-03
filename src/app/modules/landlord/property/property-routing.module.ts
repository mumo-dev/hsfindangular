import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PropertyAddComponent } from './add/property-add.component';
import { PropertyListComponent } from './list/property-list.component';
import { PropertyEditComponent } from './edit/property-edit.component';
import { PropertyLocationComponent } from './location/property-location.component';
import { PropertyPhotosComponent } from './photos/property-photos.component';
import { PropertyDashboardComponent } from './dashboard/property-dashboard.component';
import { 
  CountiesResolver, LocationResolver, PropertiesResolver, PropertyFeaturesResolver, PropertyPhotosResolver, PropertyResolver
} from './property.resolvers';
import { ListingsResolver } from '../listings/listings.resolvers';

const routes: Routes = [
  {
    path     : 'add',
    component: PropertyAddComponent
  },
  {
    path     : 'list',
    component: PropertyListComponent,
    resolve  : {
        properties: PropertiesResolver
    }
  },
  {
    path     : ':propertyId', children: [
      {
        path     : '',
        component: PropertyDashboardComponent,
        resolve  : {
            listings: ListingsResolver,
            property: PropertyResolver,
            features: PropertyFeaturesResolver
        }
      },
      {
        path     : 'edit',
        component: PropertyEditComponent,
        resolve  : {
            property: PropertyResolver
        }
      },
      {
        path     : 'location',
        component: PropertyLocationComponent,
        resolve  : {
            property: PropertyResolver,
            counties: CountiesResolver,
            location: LocationResolver
        }
      },
      {
        path     : 'photos',
        component: PropertyPhotosComponent,
        resolve  : {
            property: PropertyResolver,
            photos: PropertyPhotosResolver
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PropertyRoutingModule { }
