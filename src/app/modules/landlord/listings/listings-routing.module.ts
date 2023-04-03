import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListingsEditComponent } from './edit/listings-edit.component';
import { ListingsPhotosComponent } from './photos/listings-photos.component';
import { ListingsAddComponent } from './add/listings-add.component';
import { ListingsRentComponent } from './rent/listings-rent.component';
import { ListingsDashboardComponent } from './dashboard/listings-dashboard.component';
import { ListingsAdditionalCostsComponent } from './additional-costs/listings-additional-costs.component';
import { 
  AdditionalCostsResolver,
  ElectricityCostResolver,
  ElectricityInstallationTypesResolver,
  ExternalFeaturesResolver, InternalFeaturesResolver, ListingPhotosResolver, ListingResolver, ListingsResolver, RentResolver, WaterAvailabilityTypesResolver, WaterCostResolver
} from './listings.resolvers';

const routes: Routes = [
  {
    path     : ':propertyId/add',
    component: ListingsAddComponent
  },
  {
    path     : ':listingId', children: [
      {
        path     : 'dashboard',
        component: ListingsDashboardComponent,
        resolve  : {
            listing: ListingResolver,
            externalFeatures: ExternalFeaturesResolver,
            internalFeatures: InternalFeaturesResolver,
            rent: RentResolver,
            electricityCost: ElectricityCostResolver,
            electricityInstallationTypes: ElectricityInstallationTypesResolver,
            waterAvailabilityTypes: WaterAvailabilityTypesResolver,
            waterCost: WaterCostResolver,
            additionalCosts: AdditionalCostsResolver
        }
      },
      {
        path     : 'edit',
        component: ListingsEditComponent,
        resolve  : {
            listing: ListingResolver,
            externalFeatures: ExternalFeaturesResolver,
            internalFeatures: InternalFeaturesResolver
        }
      },
      {
        path     : 'photos',
        component: ListingsPhotosComponent,
        resolve  : {
            listing: ListingResolver,
            photos: ListingPhotosResolver
        }
      },
      {
        path     : 'rent',
        component: ListingsRentComponent,
        resolve  : {
            listing: ListingResolver,
            rent: RentResolver
        }
      },
      {
        path     : 'additionalcosts',
        component: ListingsAdditionalCostsComponent,
        resolve  : {
            listing: ListingResolver,
            additionalCosts: AdditionalCostsResolver
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListingsRoutingModule { }
