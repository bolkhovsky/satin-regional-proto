var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports"], function(require, exports) {
    /// <reference path="../typings/jquery/jquery.d.ts" />
    /// <reference path="../typings/leaflet/leaflet.d.ts" />
    /// <reference path="../typings/knockout/knockout.d.ts" />
    var Layer = (function () {
        function Layer(name, style, opacity) {
            this.name = name;
            this.style = ko.observable(style);
            this.opacity = ko.observable(opacity);
        }
        return Layer;
    })();
    exports.Layer = Layer;

    var Dataset = (function () {
        function Dataset(id, name) {
            this.id = id;
            this.name = name;
            this.layers = ko.observableArray();
        }
        return Dataset;
    })();
    exports.Dataset = Dataset;

    var DatasetViewModel = (function () {
        function DatasetViewModel() {
            this.datasets = ko.observableArray();
        }
        DatasetViewModel.prototype.loadDatasets = function (data) {
            var _this = this;
            $(data).each(function (index, item) {
                var styles = item['fields']['test_style'];
                var dataset;
                dataset = new Dataset(item['pk'], item['fields']['name']);
                $(styles.split(',')).each(function (index, item) {
                    var layer;
                    layer = new Layer(item.textContent, "", 1);
                    dataset.layers.push(layer);
                });
                _this.datasets.push(dataset);
            });
        };
        return DatasetViewModel;
    })();
    exports.DatasetViewModel = DatasetViewModel;

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
        BalticSeaMap.prototype.createLayers = function (data) {
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
            layersControl.addTo(this.map);
        };
        return BalticSeaMap;
    })(Map);
    exports.BalticSeaMap = BalticSeaMap;
});
//# sourceMappingURL=regional.js.map
