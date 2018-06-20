import { Ajax, LogHelper } from 'vincijs';
import { Component, OnInit } from '@angular/core';
import { VinciTable, DataSource, VinciWindow } from 'vincijs';
import { AssetService, HistoryService, AssetInfo } from 'cloudy-location';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-history-option-panel',
  templateUrl: './option-panel.component.html',
  styleUrls: ['./option-panel.component.css']
})
export class OptionPanelComponent implements OnInit {
  CurrentDevice: AssetInfo
  STime: string
  ETime: string
  Infos: Array<string> = []
  constructor(private historyService: HistoryService, private assetService: AssetService) { }

  ngOnInit() {
    let now = new Date();
    this.STime = `${now.getFullYear()}-${this.Ten(now.getMonth() + 1)}-${this.Ten(now.getDate())}T00:01`;
    this.ETime = `${now.getFullYear()}-${this.Ten(now.getMonth() + 1)}-${this.Ten(now.getDate())}T${this.Ten(now.getHours())}:${this.Ten(now.getMinutes())}`
  }
  private Ten(num: number): string {
    return ((num < 10) ? '0' : '') + num;
  }
  public SelectDeive() {
    let list = document.createElement("div");
    list.style.overflow = "auto";
    list.style.height = "400px";
    let table = new VinciTable(list, {
      Dbclickable: true,
      DataSource: new DataSource({
        Read: p => {
          let d = [];
          d = this.assetService.GetAssets();
          p.Success(d);
        }
      }), Columns: [{ field: "Title", title: "名称" }, { title: "类型", field: "Type" }, { title: "Id", field: "Uid" }]
    })

    let windo = new VinciWindow(list, { AutoDestory: true, Title: "选择设备" });
    windo.Open();
    table.Bind(table.Events.OnDblclick, msg => {
      this.CurrentDevice = msg.Value;
      windo.Close();
    })
  }
  public Search() {
    if (!this.CurrentDevice) {
      alert("请选择设备")
      return;
    }
    if (environment.production) {
      //TODO Get devices of asset
      new Ajax({ url: "/TM/GetHistory", data: { Id: this.CurrentDevice.Id, Begin: new Date(this.STime).toISOString(), End: new Date(this.ETime).toISOString() } })
        .done((d: { IsSuccess: boolean, Data: Array<{ Uid: string, Type: string, Id: string, Begin: string, End: string }> }) => {
          if (d && d.IsSuccess && d.Data.length > 0) {
            let array = d.Data
            //TODO  check time
            this.historyService.GetData(array.map(a => { return { uid: a.Uid, type: a.Type, sTime: a.Begin, eTime: a.End } }), (ds) => {
              ds.forEach(d => d.Name = this.CurrentDevice.Title)
            });
          } else {
            alert("当前设备在该时段内未找到对应的终端");
            return;
          }
        })
    } else {
      this.historyService.GetData([{ uid: this.CurrentDevice.Uid, type: this.CurrentDevice.Type, sTime: new Date(this.STime).toISOString(), eTime: new Date(this.ETime).toISOString() }], (ds) => {
        ds.forEach(d => { d.Name = this.CurrentDevice.Title; })// d.CollectTime = new Date(d.CollectTime).toLocaleString()
      });
    }
    this.historyService.Subscribe(undefined, (i) => {
      try {
        new Ajax({ url: "/TK/GetInfos", data: { id: this.CurrentDevice.Id, dateTime: i.CollectTime }, contentType: "json" })
          .done(d => {
            if (d.IsSuccess && d.Data) {
              this.Infos.splice(0, this.Infos.length);
              this.Infos.push(...d.Data);
            }
          })
      }
      catch (e) {
        LogHelper.Error(e)
      }
    })
  }
  public Stop() {
    this.historyService.Stop();
  }
  public Resume() {
    this.historyService.Launch();
  }
}
