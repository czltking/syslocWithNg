import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MapEditorComponent } from './map-editor.component';
const routs: Routes = [{
  path: '', component: MapEditorComponent,
}]
@NgModule({
  imports: [
    RouterModule.forChild(routs)
  ],
  exports: [RouterModule]
})
export class MapEditorRoutingModule { }
