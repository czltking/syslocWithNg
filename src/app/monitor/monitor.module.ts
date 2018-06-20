import { HttpClient } from '@angular/common/http';
import { AppConfigService } from './../app-config.service';
import { MessageComponent } from './../message/message.component';
import { TaskListComponent } from './../multi-panels/task-list/task-list.component';
import { DeviceListComponent } from './../multi-panels/device-list/device-list.component';
import { MonitorComponent } from './monitor.component';
import { MultiPanelsComponent } from './../multi-panels/multi-panels.component';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonitorRoutingModule } from './monitor-routing.module';
import { FormsModule } from '@angular/forms';
import { DeviceService, MapModule, AssetService, OlMapService, ToolbarModule,MessageModule } from 'cloudy-location'
@NgModule({
  imports: [
    CommonModule,
    MonitorRoutingModule,
    FormsModule,
    MapModule,
    ToolbarModule,
    MessageModule
  ],
  declarations: [MonitorComponent, MultiPanelsComponent
    , DeviceListComponent, TaskListComponent],
  providers: [
    {
      provide: AssetService,
      useFactory: (appConfig: AppConfigService, httpClient: HttpClient) => {
        let a = new AssetService(httpClient); a.Init(appConfig.Data["asset-profile-url"]);
        return a;
      }, deps: [AppConfigService, HttpClient]
    }, {
      provide: APP_INITIALIZER,
      useFactory: (assetService: AssetService) => { return () => assetService.Load(); },
      deps: [AssetService]
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
    },
    // {
    //   provide: Mesage,
    //   useFactory: (appConfig: AppConfigService) => {
    //     let a = new MessageService(); a.Init(appConfig.Data.map.warningService,appConfig.Data.map.warningWsType);
    //     return a;
    //   }, deps: [AppConfigService]
    // }
  ],
  // bootstrap: [MonitorComponent]
})
export class MonitorModule { }
