import { MapModule, OlMapService, ScriptService } from 'cloudy-location';
import {MultiPanelsModule} from 'vinci-ng-material'
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapEditorComponent } from './map-editor.component';
import { MapEditorRoutingModule } from './/map-editor-routing.module';
import { AppConfigService } from '../../app-config.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    MapEditorRoutingModule,
    MapModule,
    MultiPanelsModule,
    NgbModule,
    NgbModule.forRoot()
   
  ],
  declarations: [MapEditorComponent],
  providers: [{
    provide: OlMapService,
    useFactory: (appConfig: AppConfigService) => {
      let a = new OlMapService(); a.Init(appConfig.Data.map);
      return a;
    }, deps: [AppConfigService]
  }, ScriptService]
  // bootstrap: [MapEditorComponent]
})
export class MapEditorModule { }
