import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClaimsRoutingModule } from './claims-routing.module';
import { ClaimsComponent } from './claims.component';

@NgModule({
  declarations: [
    ClaimsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ClaimsRoutingModule
  ]
})
export class ClaimsModule { }