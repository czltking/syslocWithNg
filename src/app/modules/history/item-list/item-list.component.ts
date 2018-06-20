import { AppConfigService } from './../../../app-config.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DeviceService, OlMapService, HistoryService, Tracker, DataItem, GetProjByEPSG } from 'cloudy-location';
import ol_proj from 'ol/proj'
@Component({
  selector: 'app-history-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
  private pretr: HTMLTableRowElement
  private tracker: Tracker

  constructor(public historyService: HistoryService, private deviceService: DeviceService, private mapService: OlMapService, private AppConfigService: AppConfigService) { }
  ngOnInit() {
    this.historyService.Subscribe(ds => {
      var array = ds.map(d => {
        d.CollectTime = new Date(d.CollectTime).toLocaleString();
        return ol_proj.transform([d.X, d.Y], GetProjByEPSG(d.EPSG || 0), this.AppConfigService.Data.map.frontEndEpsg || 'EPSG:3857')
      }) as [number, number][];
      if (!this.tracker) {
        this.tracker = new Tracker(3, array);
        this.mapService.DrawRoute(this.tracker.GetFeature());
      } else {
        this.tracker.AddPoints(array)
      }
    }, (item, index) => {
      this.SetCurrent(index);
      let o = Object.assign({}, item, { UniqueId: "history_item", Type: "history_item" })
      //TODO show position
      this.deviceService.Resolve([o], (g, t) => { });
    })
  }

  @ViewChild("body", { read: ElementRef })
  private body: ElementRef
  @ViewChild("bodyContainer", { read: ElementRef })
  private bodyContainer: ElementRef
  private SetCurrent(index: number, scroll: boolean = true) {
    let tbody = this.body.nativeElement as HTMLTableSectionElement;
    if (this.pretr) this.pretr.classList.remove("bg-success");
    (this.pretr = tbody.children[index] as HTMLTableRowElement).classList.add("bg-success");
    if (scroll)
      (this.bodyContainer.nativeElement as HTMLDivElement).scrollTop = this.pretr.offsetTop - 100;
  }
  public ItemClick(dataItem: DataItem, index: number) {
    this.historyService.Stop();
    this.SetCurrent(index, false);
    let o = Object.assign({}, dataItem, { UniqueId: "history_item", Type: "history_item" })
    this.deviceService.Resolve([o], (g, t) => { });
    this.historyService.SetCurrentIndex(index);
  }
}
