import { MapComponent, OlMapService, ScriptService } from 'cloudy-location';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Parameter } from '../../utilities/interface';
import olProj from 'ol/proj'
import ol_feature from 'ol/feature'
import ol_polygon from 'ol/geom/polygon'
import { AppConfigService } from '../../app-config.service';
import * as jQuery from 'jquery'
import 'jquery-ui'
import { VinciWindow, Ajax } from 'vincijs';
//import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { View } from 'openlayers';

//import { AngularFontAwesomeModule } from 'angular-font-awesome';
// import 'font-awesome'

@Component({
  selector: 'app-map-editor',
  templateUrl: './map-editor.component.html',
  styleUrls: ['./map-editor.component.css']
})
export class MapEditorComponent implements OnInit, AfterViewInit {
  private feature: ol.Feature
  private p: Parameter
  private strReg: string
  private strRegDW: string
  private strRegDM: string;
  private editReg: string = "";
  public document = window.document;
  public regDWList = [];//电子围栏
  public rcDMList = [];//电子点名


  private drawType: string = 'alarmRegion';
  private strShowRegEmp: string;
  private select: ol.interaction.Select

  @ViewChild("content")
  private first: HTMLElement
  private openDig;


  @ViewChild("showEmp")
  private showDialog: HTMLElement;
  private showOpen;

  @ViewChild("rcallReg")
  private second: HTMLElement;
  private rcDialog;

  public regTypes: string[] = ['电子围栏', '电子点名'];
  getChange() {
    // this.regId = jQuery('#leader').val().toString();
    let selectValue = jQuery('#leader').val().toString();
    if (selectValue == '电子围栏') {
      this.drawType = 'alarmRegion';
    } else if (selectValue == '电子点名') {
      this.drawType = 'rollcallRegion';
    }

  }

  ngAfterViewInit(): void {
    this.select = this.OlMapService.SelectDraw((fs) => { }) as ol.interaction.Select;
  }
  constructor(private OlMapService: OlMapService, private ScriptService: ScriptService, private AppConfigService: AppConfigService, private modalService: NgbModal) { }
  @ViewChild(MapComponent, { read: MapComponent })
  private map: MapComponent
  @ViewChild(MapComponent, { read: ElementRef })
  private mapElement: ElementRef
  @ViewChild("window", { read: ElementRef })
  private window: ElementRef;
  ngOnInit() {
  }


  private DrawPolygon() {
    this.ClearFeature();
    this.DrawReg("Polygon");

  }
  private DrawCircle(feature?: Array<ol.Feature>) {
    this.ClearFeature();
    this.DrawReg("Circle");
  }
  private ClearFeature() {
    this.select.getFeatures().clear();
    this.feature = undefined;
  }



  public showPoint() {
    // let div = jQuery(this.strRegDW)[0] as HTMLDivElement;
    // new VinciWindow(div, { AutoDestory: true, Title: '电子围栏' }).Open();
    this.showOpen = this.open(this.showDialog);
    // this.FindEmpInfo();
    let data = [{ Name: '战士', PositionTag: { Name: '111', Code: '111' } }, { Name: '看看', PositionTag: { Name: '222', Code: '222' } }, { Name: '贴图', PositionTag: { Name: '333', Code: '333' } }];
    this.loadRegEmp(data);

  }
  public Save() {
    // jQuery().dialog()
    if (this.feature) {
      var g = this.feature.getGeometry() as ol.geom.Polygon;
      var coordinates = g.getCoordinates()[0].map(c => {
        let fr = olProj.transform(c, this.AppConfigService.Data.map.srs, "EPSG:4326");
        return { X: fr[0], Y: fr[1] }
      });
      this.p.CustomRegion = JSON.stringify(coordinates);
      this.SendBackData(this.p);
    } else if (confirm("没有选择任何路段，是否继续保存？")) {
      this.p.CustomRegion = null;
      this.SendBackData(this.p);
    }
  }
  public Reset() {
    this.Clear();
    this.Draw();
  }

  public regId = undefined;  //所画区域ID
  public regDawType = 2; //所画图形的类型 2-多边形  4-圆形
  public strPoints = "";  //所画点的字符串，0,0,0&0,0,0&
  public pointDrawList = []
  public isSaveReg: boolean = false;

  private DrawReg(strRegType: string, features?: Array<ol.Feature>) {
    this.strReg = strRegType;
    this.OlMapService.Draw(strRegType, (f: ol.Feature) => {
      this.feature = f;
      let points = undefined;
      // let regId = undefined;
      //  let regDawType = 2;
      this.regId = new Date().getTime();

      this.feature.setId(this.regId);
      if (this.strReg == "Polygon") {

        let polygon = (this.feature.getGeometry() as ol.geom.Polygon);
        points = polygon.getCoordinates()[0];

        this.regDawType = 2;
      } else if (this.strReg == "Circle") {
        let circle = (this.feature.getGeometry() as ol.geom.Circle);
        // points =circle.getCenter(); //中心点
        let p1 = circle.getCenter();//圆心
        let p2 = circle.getLastCoordinate(); //圆上一点
        points = [p1, p2];

        this.regDawType = 4;
      }
      let psList = [];
      jQuery.each(points, function (i, n) {

        let newP = { x: (n[0]), y: (n[1]), z: 0 };
        psList.push(newP);
      });
      this.pointDrawList = psList;

      // var newP = { x: (data.x - tranX), y: (data.y - tranY), z: data.z };        psList.push(newP);
      //this.strPoints = drawPs;

      // let regParament = JSON.stringify(points);
      if (this.drawType == 'alarmRegion') {
        this.openDig = this.open(this.first);
        //content
        //  let div = jQuery(this.strRegDW)[0] as HTMLDivElement;
        // new VinciWindow(div, { AutoDestory: true, Title: '电子围栏' }).Open();
      }
      else if (this.drawType == 'rollcallRegion') {

        this.rcDialog = this.open(this.second);
        // let div = jQuery(this.strRegDM)[0] as HTMLDivElement;
        // new VinciWindow(div, { AutoDestory: true, Title: '电子点名' }).Open();
      }
      // this.openDialog("");

      ////  LINE: 1,//线   POLYGON: 2,//多边形  RECTANGLE: 3,//矩形    CIRCLE: 4 //圆   
      // let regMes = [{ id: regId, showName: this.strReg, drawType: regDawType, pointList: points, drawJson: "111", alarmTags: "222" }];
      // this.saveReg(regMes, this.strReg);
      this.OlMapService.SelectDraw(() => { });
    }, undefined, features)
  }

  open(content) {
    let modalRef = this.modalService.open(content);
    // this.openDig=modalRef;
    return modalRef;

  }

  private openDialog(strRegType: string) {
    let div = jQuery(this.strRegDW)[0] as HTMLDivElement
    new VinciWindow(div, { AutoDestory: true, Title: strRegType }).Open()
  }
  private saveReg(parameter, regKey: string,strEmpNames) {
    //alert("OK " + regKey);
    let urlPath = "/Graphic/SaveRegList";
    let strJson = { strKey: regKey, strValue: parameter };
    let selfKey = regKey;
    let selfDraw = parameter[0];
    console.log(strJson);
    let regMode = { id: selfDraw.id, showName: selfDraw.showName,empIds:selfDraw.alarmTags,empNames:strEmpNames };
    if (selfKey == "alarmRegion") {
      this.regDWList.push(regMode);

    } else if (selfKey == "rollcallRegion") {
      this.rcDMList.push(regMode);
    }

    // new Ajax({ url: urlPath, data: strJson, contentType: "json" }).done(d => {
    //   let regMode={id:selfDraw.id,showName:selfDraw.showName};   
    //   if(selfKey=="alarmRegion"){           
    //     this.regDWList.push(regMode);

    //   }else if(selfKey=="rollcallRegion"){
    //     this.rcDMList.push(regMode);
    //   }
    //   alert("保存成功...");
    // });

  }

  //#region *********************区域人员配置**************************

  ///修改电子围栏
  onSelectDW(item) {
    if (this.openDig != undefined)
      this.openDig.close();
    this.openDig = this.open(this.first);
    //根据Id找到对象
    let regMode=undefined;
    jQuery.each(this.regDWList,function(i,reg){
      if(item.id==reg.id)
      {
        regMode=reg;
      }
    });
    if(regMode!=undefined)
    {
      this.editReg = "Edit";
      //修改
       jQuery("#regNames").val(regMode.showName); 
       jQuery("#empNames").val(regMode.empNames);
       jQuery("#empNames").data("perid",regMode.empNames);
    }

  }
  FindEmpInfo() {
    let urlPath = "/Graphic/GetEmpTagList";
    new Ajax({ url: urlPath, data: "", contentType: "json" }).done(data => {
      this.loadRegEmp(data.Data);
    });

  }

  loadRegEmp(data) {
    if (data != null) {
      let option1 = "";
      let option2 = "";
      let isTrue = true;
      jQuery("#ls1").empty();
      jQuery("#ls2").empty();
      let pointId = jQuery("#empNames").data("perid").toString();
      if (this.editReg == "Edit" || pointId != "0") {
        // var pointList = jQuery("#pointList").data("perid").split(",");
        var pointList = [];
        if (pointId.indexOf(",") >= 0)
          pointList = pointId.split(",");
        else
          pointList.push(pointId.trim());
        jQuery.each(data, function (i, tag) {
          isTrue = false;
          if (jQuery.inArray(tag.PositionTag.Code, pointList) == -1) {
            option1 += "<option value=" + tag.PositionTag.Code + ">" + tag.Name + "</option>";
          } else {
            //option2 += "<option value=" + tag.ID + ">" + tag.Name + "</option>";
          }

        });
        jQuery.each(pointList, function (i, tag) {
          data.forEach(function (d) {
            if (d.PositionTag.Code == tag) {
              option2 += "<option value=" + d.PositionTag.Code + ">" + d.Name + "</option>";
            }
          });
        });
        jQuery("#ls1").append(option1);
        jQuery("#ls2").append(option2);
      } else {
        jQuery.each(data, function (i, tag) {
          //option1 += "<option value=" + tag.TagCode + ">" + tag.TName + "</option>";
          option1 += "<option value=" + tag.PositionTag.Code + ">" + tag.Name + "</option>";
        });
        jQuery("#ls1").append(option1);
      }
    }
  }

  moveOption(e1, e2) {
    for (var i = 0; i < e1.options.length; i++) {
      if (e1.options[i].selected) {
        var e = e1.options[i];
        e2.options.add(new Option(e.text, e.value));
        e1.remove(i);
        i = i - 1
      }
    }
  }

  setPointList() {
    var rulesName = [];
    var rulesId = [];
    jQuery("#ls2 option").each(function () {
      rulesName.push(jQuery(this).text());
      rulesId.push(jQuery(this).val());
    });
    jQuery("#empNames").val(rulesName.join(","));
    jQuery("#empNames").data("perid", rulesId.join(","));
    this.showOpen.close();

  }

  saveRegEmp() {
    var isTrue = true;
    jQuery("#lblMessage").text("");
    let regName = jQuery("#regNames").val();//document.getElementById("regNames").value;
    let empNames = jQuery("#empNames").val();//document.getElementById("empNames").value;
    let empIds = jQuery("#empNames").data("perid"); // jQuery("#empNames").val
    // var regName= document.getElementById('regName').value; 
    if (regName == '') {
      // alert('区域名称不能为空...');
      jQuery("#lblMessage").text("区域名称不能为空...");
      return false;
    }
    if (empNames == "") {
      jQuery("#lblMessage").text("未设置禁入人员的区域不会触发报警...");
      // return false;
    }

    let regMes = [{ id: this.regId, showName: regName, drawType: this.regDawType, pointList: this.pointDrawList, drawJson: "OL", alarmTags: empIds }];
    this.saveReg(regMes, this.drawType,empNames);

    if (this.editReg == "Edit") {
      // GraphList.updateObj(selfDraw);
      // sys.busi2D.updateAlarmRegName('la_' + selfDraw.id, regName);
    } else {
      // GraphList.add(selfDraw);
      // sys.busi2D.addAlarmReg(selfDraw);
    }

    // sys.busi2D.saveDrawOneRegion(selfDraw);
    this.isSaveReg = true;
    // //  jQuery("#lblMessage").text("保存成功...");
    return isTrue;


  }

  indexClose() {
    var regName = jQuery("#regNames").val(); //document.getElementById("regNames").value;
    var empNames = jQuery("#empNames").val(); //document.getElementById("empNames").value;
    var empIds = jQuery("#empNames").data("perid"); // jQuery("#empNames").val
    //var sDraw = selfDraw;
    // var sShape = selfShape;

    if (regName == '') {
      // alert('区域名称不能为空...');
      if (this.editReg == "")
        this.Clear();
      // obj2DRegion.remove(selfShape);
    } else {
      if (this.isSaveReg == false) {
        if (this.editReg == "") {
          this.saveRegEmp();
          // layer.msg('是否保存已画区域...', {
          //     time: 0 //不自动关闭
          //     , btn: ['是', '否']
          //     , yes: function (index) {
          //         selfDraw = sDraw;
          //         selfShape = sShape;
          //         sys.busi2D.saveRegByClose(regName, empIds, empNames);
          //         layer.close(index);
          //     }, btn2: function () {
          //         obj2DRegion.remove(sShape);
          //         layer.close();
          //     }
          // });
        }
      }
    }
    this.isSaveReg = false;
    this.editReg = "";
    // this.openDig.close();

  }

  //#endregion


  //#region ***********************************电子点名*********************************************************
  onSelectRcDM(item) {

  }

  saveRegRollCall() {
    var isTrue = true;
    jQuery("#lblMessage").text("");
    let regName = jQuery("#regNames").val();  //document.getElementById("regNames").value;
    if (regName == '') {
      // alert('区域名称不能为空...');
      jQuery("#lblMessage").text("区域名称不能为空...");
      return false;
    }


    // selfDraw.showName = regName;
    var flag = jQuery("#isEndPoint").is(':checked');
    flag == true ? "1" : "0";

    let regMes = [{ id: this.regId, showName: regName, drawType: this.regDawType, pointList: this.pointDrawList, drawJson: "OL", alarmTags: flag }];
    this.saveReg(regMes, this.drawType,"");
    // selfDraw.EmpNames = "";

    // selfShape.EmpNames = empNames;
    // selfShape.busType = regionDraw;
    // selfShape.showname = regName;
    if (this.editReg == "Edit") {
      // RollCallList.updateObj(selfDraw);
      // sys.busi2D.updateAlarmRegName('la_' + selfDraw.id, regName);


    } else {
      // RollCallList.add(selfDraw);
      // sys.busi2D.addRollCallReg(selfDraw);
    }

    //sys.busi2D.saveDrawOneRegion(selfDraw);
    this.isSaveReg = true;


    return isTrue;


  }


  indexCloseRollCall() {
    var regName = jQuery("#regNames").val();
    var flag = jQuery("#isEndPoint").is(':checked');

    // var sDraw = selfDraw;
    // var sShape = selfShape;

    if (regName == '') {
      // alert('区域名称不能为空...');
      if (this.editReg == "")
        this.Clear();
    } else {
      if (this.isSaveReg == false) {
        if (this.editReg == "") {
          this.saveRegRollCall();
          // layer.msg('是否保存已画区域...', {
          //     time: 0 //不自动关闭
          //     , btn: ['是', '否']
          //     , yes: function (index) {
          //         selfDraw = sDraw;
          //         selfShape = sShape;
          //         sys.busi2D.saveRegRollCallByClose(regName, flag);
          //         layer.close(index);
          //     }, btn2: function () {
          //         obj2DRegion.remove(sShape);
          //         layer.close();
          //     }
          // });
        }
      }
    }
    this.isSaveReg = false;
    this.editReg = "";
    // this.rcDialog.close();

  }
  //#endregion

  private Draw(features?: Array<ol.Feature>) {
    this.OlMapService.Draw("Polygon", (f: ol.Feature) => {
      this.feature = f;
    }, undefined, features)
  }

  public Clear() {
    if (this.feature)
      this.OlMapService.RemoveDrawFeature(this.feature)
    this.feature = undefined;
  }
  protected SendBackData(data?: Parameter) {
    window.parent["SetCustomRegion"](data);
  }
  protected GetData(): Parameter {
    // let t: Parameter = {} as Parameter;
    let t: Parameter = window.parent["GetTask"]();
    return t;
  }
}
