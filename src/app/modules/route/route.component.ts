import { AppConfigService } from './../../app-config.service';
import { OlMapService } from 'cloudy-location';
import olProj from 'ol/proj'
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Parameter } from '../../utilities/interface';

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.css']
})
export class RouteComponent implements OnInit, AfterViewInit {
  private selectInteraction: ol.interaction.Interaction
  ngAfterViewInit(): void {
    this.OlMapService.LoadWfs(layer => {
      this.OlMapService.AddLayer(layer);
      this.selectInteraction = this.OlMapService.SelectInLayer([layer], fs => {
      })
    }, this.AppConfigService.Data.map.geoServerUrl, `${this.AppConfigService.Data.map.geoServerGroup}:Roads`)
  }
  constructor(private OlMapService: OlMapService, private AppConfigService: AppConfigService) { }

  ngOnInit() {

  }
  public Save() {
    let params = this.GetData();
    let features = (this.selectInteraction as ol.interaction.Select).getFeatures().getArray();
    if (features && features.length > 0) {
      params.Task_Assetss.forEach(ta => {
        let res = features.map(f => {
          let s = f.getGeometry() as ol.geom.MultiLineString;
          let coordinates = s.getCoordinates()[0] as Array<[number, number]>;
          return coordinates.map(c => {
            let fr = olProj.transform(c, this.AppConfigService.Data.map.srs, "EPSG:4326");
            return { X: fr[0], Y: fr[1] };
          })
        })
        ta.CurrentRoute = JSON.stringify(res);
      })
      this.SendBackData(params);
    } else if (confirm("没有选择任何路段，是否继续保存？")) {
      params.Task_Assetss.forEach(a => a.CurrentRoute = null)
      this.SendBackData(params);
    }
  }
  public Clean() {
    (this.selectInteraction as ol.interaction.Select).getFeatures().clear()
  }
  protected SendBackData(data?: Parameter) {
    window.parent["SetTask"](data);
  }
  protected GetData(): Parameter {
    // let t: Parameter = { Task_Assetss: [{}] } as Parameter;
    let t: Parameter = window.parent["GetTask"]();
    return t;
  }
}
