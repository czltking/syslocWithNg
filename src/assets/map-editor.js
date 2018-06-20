var MapEditor = /** @class */ (function () {
    function MapEditor(container, mapService, deviceService) {
        this.container = container;
        this.mapService = mapService;
        this.deviceService = deviceService;
        this.Init();
    }
    MapEditor.prototype.Init = function () {
        var that = this;
        that.mapService.SelectDraw(function (ff) {
            console.log(ff);
        });
        that.mapService.Draw("Polygon", function (f) {
            console.log(f);
        });
    };
    return MapEditor;
}());
