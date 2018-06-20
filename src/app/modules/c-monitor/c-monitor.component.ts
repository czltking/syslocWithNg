import { MapComponent, OlMapService, DeviceService, AssetService, ScriptService } from 'cloudy-location';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
@Component({
  selector: 'app-c-monitor',
  templateUrl: './c-monitor.component.html',
  styleUrls: ['./c-monitor.component.css']
})
export class CMonitorComponent implements OnInit, AfterViewInit {
  @ViewChild(MapComponent)
  private map: MapComponent
  @ViewChild(MapComponent, { read: ElementRef })
  private mapElement: ElementRef
  constructor(private ScriptService: ScriptService, private OlMapService: OlMapService, private DeviceService: DeviceService, private AssetService: AssetService) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.ScriptService.load("cmonitor").then(() => {
      new window["MapMonitor"](this.mapElement.nativeElement, this.OlMapService, this.DeviceService, this.AssetService);
    })
  }
}
