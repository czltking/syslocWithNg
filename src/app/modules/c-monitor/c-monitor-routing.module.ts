import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CMonitorComponent } from './c-monitor.component';
const routes: Routes = [{
  path: '', component: CMonitorComponent,
}]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CMonitorRoutingModule { }
