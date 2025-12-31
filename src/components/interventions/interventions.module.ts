import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InterventionsRoutingModule } from './interventions-routing.module';
import { InterventionsComponent } from './interventions.component';

@NgModule({
  declarations: [
    InterventionsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InterventionsRoutingModule
  ]
})
export class InterventionsModule { }