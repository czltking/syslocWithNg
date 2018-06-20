import { AppConfigService } from './../app-config.service';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MapComponent, DeviceService, AssetService, ToolbarComponent, DeviceStatus, GraphicOutInfo } from 'cloudy-location';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css']
})
export class MonitorComponent implements OnInit, AfterViewInit {
  @ViewChild(MapComponent)
  private map: MapComponent
  @ViewChild(ToolbarComponent)
  private toobar: ToolbarComponent
  public InfoUrl: string

  ngAfterViewInit(): void {
    // this.DeviceService.Bind(this.DeviceService.Events.DeviceUpdate, (msg) => {
    //   let value: { data: GraphicOutInfo, type: DeviceStatus } = msg.Value
    //   switch (value.type) {
    //     case DeviceStatus.Offline:
    //       this.msg.PushMsg({
    //         msg: this.msg.MsgFormat("离线", value.data.Title), data: {
    //           WarningType: { Code: "offline", Description: "offline", Name: "离线" },
    //           Task_Assets: { TerminalType: { Description: value.data.type }, UniqueidGPSTerminal: value.data.Id },
    //           AssetName: value.data.Title
    //         }
    //       })
    //       break;
    //   }
      // var values: Array<{ Uid: string, DevType: string, Msg: string, SubType: string, MsgType: DeviceStatus, AssetName: string }> = msg.Value
      // values.forEach(value => {
      //   switch (value.SubType.toLowerCase()) {
      //     case "offline":
      //       this.msg.Msgs.push({
      //         msg: `离线：`, data: {
      //           WarningType: { Code: "offline", Description: "offline", Name: "离线" },
      //           Task_Assets: { TerminalType: { Description: value.DevType }, UniqueidGPSTerminal: value.Uid },
      //           AssetName: value.AssetName
      //         }
      //       });
      //       break;
      //   }
      // })
    // })
  }
  constructor(public AppConfigService: AppConfigService, private DeviceService: DeviceService, private AssetService: AssetService) {
  }
  ngOnInit() {
    this.InfoUrl = this.AppConfigService.Data.map.infoUrl;
  }

}
