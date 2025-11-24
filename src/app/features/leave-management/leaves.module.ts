import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeaveApplyComponent } from './leave-apply/leave-apply.component';
import { LeaveApprovalComponent } from './leave-approval/leave-approval.component';
import { LeaveListComponent } from './leave-list/leave-list.component';
import { LeavesRoutingModule } from './leaves-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LeavesRoutingModule,
    LeaveApplyComponent,
    LeaveApprovalComponent,
    LeaveListComponent
  ]
})
export class LeavesModule { }
