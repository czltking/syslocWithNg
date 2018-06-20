import { HttpClient } from '@angular/common/http';
import { MapModule, OlMapService, DeviceService, AssetService, ScriptService } from 'cloudy-location';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CMonitorRoutingModule } from './c-monitor-routing.module';
import { CMonitorComponent } from './c-monitor.component';
import { AppConfigService } from '../../app-config.service';

@NgModule({
  imports: [
    CommonModule,
    CMonitorRoutingModule,
    MapModule
  ],
  providers: [{
    provide: AssetService,
    useFactory: (appConfig: AppConfigService, httpClient: HttpClient) => {
      let a = new AssetService(httpClient); a.Init(appConfig.Data["asset-profile-url"]);
      return a;
    }, deps: [AppConfigService, HttpClient]
  },
  {
    provide: OlMapService,
    useFactory: (appConfig: AppConfigService) => {
      let a = new OlMapService(); a.Init(appConfig.Data.map);
      return a;
    }, deps: [AppConfigService]
  }, {
    provide: DeviceService,
    useFactory: (appConfig: AppConfigService) => {
      let a = new DeviceService(); a.Init(appConfig.Data.map);
      return a;
    }, deps: [AppConfigService]
  }],
  declarations: [CMonitorComponent]
})
export class CMonitorModule { }
