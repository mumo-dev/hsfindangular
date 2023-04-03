import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { FuseCardModule } from '@fuse/components/card';
import { FuseAlertModule } from '@fuse/components/alert';
import { MatExpansionModule } from '@angular/material/expansion'; 
import { MatStepperModule } from '@angular/material/stepper'; 

import { ListingsRoutingModule } from './listings-routing.module';
import { ListingsEditComponent } from './edit/listings-edit.component';
import { ListingsPhotosComponent } from './photos/listings-photos.component';
import { ListingsAddComponent } from './add/listings-add.component';
import { ListingsRentComponent } from './rent/listings-rent.component';
import { ListingsDashboardComponent } from './dashboard/listings-dashboard.component';
import { ListingsAdditionalCostsComponent } from './additional-costs/listings-additional-costs.component';

@NgModule({
  declarations: [
    ListingsEditComponent,
    ListingsPhotosComponent,
    ListingsAddComponent,
    ListingsRentComponent,
    ListingsDashboardComponent,
    ListingsAdditionalCostsComponent
  ],
  imports: [
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    MatProgressBarModule,
    MatSortModule,
    MatTableModule,
    NgApexchartsModule,
    FuseCardModule,
    FuseAlertModule,
    MatExpansionModule,
    MatStepperModule,
    SharedModule,
    ListingsRoutingModule
  ]
})
export class ListingsModule { }
