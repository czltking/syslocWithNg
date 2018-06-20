import { AppConfigService } from './../app-config.service';
import { AssetService } from 'cloudy-location';
import { Component, OnInit } from '@angular/core';
import { WebSocketor, LogHelper } from 'vincijs';
export interface WarningEntity {
  WarningType: { Code: string, Description: string, Name: string }
  Task_Assets: { TerminalType: { Description: string }, UniqueidGPSTerminal: string }
  AssetName: string
}
@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  Msgs: Array<{ msg: string, data: WarningEntity }> = []
  constructor(private AssetService: AssetService, private appConfigService: AppConfigService) { }

  ngOnInit() {
    if (this.appConfigService.Data.map.msgConfig) {
      new WebSocketor({ Url: this.appConfigService.Data.map.msgConfig.ServiceURI }).Open(evt => {
        let datas: Array<WarningEntity> = JSON.parse(evt.data);
        datas.forEach(d => {
          try {
            let i = this.AssetService.Get(d.Task_Assets.UniqueidGPSTerminal, d.Task_Assets.TerminalType.Description)
            this.PushMsg({ msg: this.MsgFormat(d.WarningType.Name, i.Title), data: d });
            // this.Msgs.push({ msg: `${d.WarningType.Name}:${i.Title}--${new Date().toLocaleTimeString()}`, data: d })
            //TODO show modal window
            //TODO update data
          }
          catch (e) {
            LogHelper.Log(e);
          }
        })
      })
    }
  }

  public MsgFormat(warnningName: string, assetName: string) {
    return `${warnningName}:${assetName} --${new Date().toLocaleTimeString()}`
  }

  public PushMsg(msg: { msg: string, data: WarningEntity }) {
    this.Msgs.unshift(msg)
    if (this.Msgs.length > 20)
      this.Msgs.pop()
  }
}
