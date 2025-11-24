import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalRoutingModule } from './portal-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StaffManagementComponent } from './staff-management/staff-management.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PortalRoutingModule,
    DashboardComponent,
    StaffManagementComponent
  ]
})
export class PortalModule { }
