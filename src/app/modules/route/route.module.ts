import { RouteComponent } from './route.component';
import { OlMapService, MapModule } from 'cloudy-location';
import { AppConfigService } from './../../app-config.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouteRoutingModule } from './route-routing.module';

@NgModule({
  imports: [
    CommonModule,
    RouteRoutingModule,
    MapModule
  ],
  declarations: [RouteComponent],
  providers: [{
    deps: [AppConfigService], useFactory: (appConfig: AppConfigService) => {
      let a = new OlMapService(); a.Init(appConfig.Data.map);
      return a;
    }, provide: OlMapService
  }]
})
export class RouteModule { }
