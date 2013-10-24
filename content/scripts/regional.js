/// <reference path="typings/jquery/jquery.d.ts" />
/// <reference path="typings/leaflet/leaflet.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports"], function(require, exports) {
    var Map = (function () {
        function Map() {
        }
        return Map;
    })();
    exports.Map = Map;

    var BalticSeaMap = (function (_super) {
        __extends(BalticSeaMap, _super);
        function BalticSeaMap(elId) {
            _super.call(this);

            this.map = new L.Map(elId, { center: new L.LatLng(60, 27), zoom: 7 });
            var tileLayer = new L.TileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery Â© <a href="http://cloudmade.com">CloudMade</a>'
            });
            tileLayer.addTo(this.map);
        }
        BalticSeaMap.prototype.loadDatasets = function () {
            var _this = this;
            $.getJSON('/datasets', function (data) {
                var layersControl = new L.Control.Layers();
                $(data).each(function (index, item) {
                    var dsName = item['fields']['name'];
                    var layers = item['fields']['test_layer'];
                    var styles = item['fields']['test_style'];
                    var wmsLayer = new L.TileLayer.WMS('http://geo.solab.rshu.ru:7000/wms/' + dsName + '/', {
                        layers: layers,
                        format: 'image/png',
                        transparent: true,
                        styles: styles,
                        version: "1.1.1"
                    });
                    wmsLayer.setParams({
                        /*TIME: item['fields']['test_date'],*/
                        ELEVATION: '0'
                    });
                    layersControl.addOverlay(wmsLayer, dsName);
                });
                layersControl.addTo(_this.map);
            });
        };
        return BalticSeaMap;
    })(Map);
    exports.BalticSeaMap = BalticSeaMap;
});
//# sourceMappingURL=regional.js.map
