import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocationsRoutingModule } from './locations-routing.module';
import { LocationListComponent } from '@components/locations/location-list/location-list.component';
import { LocationFormDialogComponent } from '@components/locations/dialogs/location-form-dialog/location-form-dialog.component';
import { LocationViewComponent } from '@components/locations/location-view/location-view.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatSlideToggleModule, MatTableModule, MatSortModule, MatCardModule } from '@angular/material';
import { AgmCoreModule } from '@agm/core';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    LocationListComponent,
    LocationFormDialogComponent,
    LocationViewComponent,
  ],
  imports: [
    CommonModule,
    LocationsRoutingModule,
    SharedModule,
    MatSlideToggleModule,
    MatTableModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyACCrhxPECAdny-D4CO5R6hG_Vo8vjHmR8'
    }),
    ReactiveFormsModule,
    MatSortModule,
    MatCardModule
  ],

  entryComponents: [
    LocationFormDialogComponent
  ]
})
export class LocationsModule { }
