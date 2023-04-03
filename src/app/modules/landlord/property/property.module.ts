import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';

import { PropertyRoutingModule } from './property-routing.module';
import { PropertyAddComponent } from './add/property-add.component';
import { PropertyListComponent } from './list/property-list.component';
import { PropertyEditComponent } from './edit/property-edit.component';
import { PropertyLocationComponent } from './location/property-location.component';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion'; 
import { FuseCardModule } from '@fuse/components/card';
import { FuseAlertModule } from '@fuse/components/alert';
import { PropertyPhotosComponent } from './photos/property-photos.component';
import { PropertyDashboardComponent } from './dashboard/property-dashboard.component';


@NgModule({
  declarations: [
    PropertyAddComponent,
    PropertyListComponent,
    PropertyEditComponent,
    PropertyLocationComponent,
    PropertyPhotosComponent,
    PropertyDashboardComponent
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
    MatTooltipModule,
    MatExpansionModule,
    FuseAlertModule,
    SharedModule,
    PropertyRoutingModule
  ]
})
export class PropertyModule { }
