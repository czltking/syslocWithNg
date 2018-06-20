import { HttpClient } from '@angular/common/http';
import { MapModule, OlMapService, AssetService, DeviceService, HistoryService } from 'cloudy-location';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HistoryRoutingModule } from './history-routing.module';
import { HistoryComponent } from './history.component';
import { ItemListComponent } from './item-list/item-list.component';
import { OptionPanelComponent } from './option-panel/option-panel.component';
import { AppConfigService } from '../../app-config.service';

@NgModule({
  imports: [
    CommonModule,
    HistoryRoutingModule,
    MapModule
  ],
  declarations: [HistoryComponent, ItemListComponent, OptionPanelComponent],
  providers: [{
    provide: OlMapService,
    useFactory: (appConfig: AppConfigService) => {
      let a = new OlMapService(); a.Init(appConfig.Data.map);
      return a;
    }, deps: [AppConfigService]
  }, {
    provide: HistoryService,
    useFactory: (appConfig: AppConfigService) => {
      let a = new HistoryService(); a.Init(appConfig.Data.map);
      return a;
    }, deps: [AppConfigService]
  }, {
    provide: AssetService,
    useFactory: (appConfig: AppConfigService, httpClient: HttpClient) => {
      let a = new AssetService(httpClient); a.Init(appConfig.Data["asset-profile-url"]);
      return a;
    }, deps: [AppConfigService, HttpClient]
  }, {
    provide: DeviceService,
    useFactory: (appConfig: AppConfigService) => {
      let a = new DeviceService(); a.Init(appConfig.Data.map);
      return a;
    }, deps: [AppConfigService]
  }]
})
export class HistoryModule { }
