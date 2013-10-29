/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/leaflet/leaflet.d.ts" />
/// <reference path="../typings/knockout/knockout.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports"], function(require, exports) {
    var Layer = (function () {
        function Layer(name, style, opacity) {
            var _this = this;
            this.name = name;
            this.style = ko.observable(style);
            this.opacity = ko.observable(opacity);
            this.opacity.subscribe(function (val) {
                if (_this.wmsLayer != null) {
                    var opacity = val / 10;
                    _this.wmsLayer.setOpacity(opacity);
                }
            });
            this.isChecked = ko.observable(false);
            this.isChecked.subscribe(function (val) {
                console.log('isChecked');
            });
        }
        Layer.prototype.toggle = function () {
            if (this.map.hasLayer(this.wmsLayer)) {
                console.log('remove layer');
                this.map.removeLayer(this.wmsLayer);
            } else {
                console.log('add layer');
                this.map.addLayer(this.wmsLayer);
            }
            return true;
        };
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
                var dataset;
                dataset = new Dataset(item['pk'], item['fields']['name']);
                $(item['fields']['test_layer'].split(',')).each(function (index, lr) {
                    var layer;
                    layer = new Layer(lr.toString(), item['fields']['test_style'], 1);
                    dataset.layers.push(layer);
                });
                _this.datasets.push(dataset);
            });
            return this.datasets;
        };
        return DatasetViewModel;
    })();
    exports.DatasetViewModel = DatasetViewModel;

    var BaseMap = (function () {
        function BaseMap(id, options) {
            this.map = new L.Map(id, options);
        }
        return BaseMap;
    })();
    exports.BaseMap = BaseMap;

    var BalticSeaMap = (function (_super) {
        __extends(BalticSeaMap, _super);
        function BalticSeaMap(elId) {
            _super.call(this, elId, { center: new L.LatLng(60, 27), zoom: 7 });
            var tileLayer = new L.TileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery Â© <a href="http://cloudmade.com">CloudMade</a>'
            });
            tileLayer.addTo(this.map);
        }
        BalticSeaMap.prototype.setDatasets = function (datasets) {
            for (var i = 0; i < datasets().length; i++) {
                var dataset;
                dataset = datasets()[i];
                for (var j = 0; j < dataset.layers().length; j++) {
                    var layer;
                    layer = dataset.layers()[j];
                    layer.wmsLayer = new L.TileLayer.WMS('http://geo.solab.rshu.ru:7000/wms/' + dataset.name + '/', {
                        layers: layer.name,
                        format: 'image/png',
                        transparent: true,
                        styles: layer.style.peek(),
                        version: "1.1.1"
                    });
                    layer.wmsLayer.setParams({
                        ELEVATION: '0'
                    });
                    layer.wmsLayer.setOpacity(layer.opacity.peek());
                    layer.map = this.map;
                }
            }
        };
        return BalticSeaMap;
    })(BaseMap);
    exports.BalticSeaMap = BalticSeaMap;
});
//# sourceMappingURL=regional.js.map
