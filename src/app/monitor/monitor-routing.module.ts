import { MonitorComponent } from './monitor.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routs: Routes = [{
  path: '', component: MonitorComponent,
}]
@NgModule({
  imports: [
    RouterModule.forChild(routs)
  ],
  exports: [RouterModule],
})
export class MonitorRoutingModule { }
