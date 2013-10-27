/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/leaflet/leaflet.d.ts" />
/// <reference path="../typings/knockout/knockout.d.ts" />
export class Layer {
    name: string;
    style: KnockoutObservable<string>;
    opacity: KnockoutObservable<number>;

    constructor(name: string, style: string, opacity: number) {
        this.name = name;
        this.style = ko.observable(style);
        this.opacity = ko.observable(opacity);
    }
}

export class Dataset {
    id: number;
    name: string;
    layers: KnockoutObservableArray<Layer>;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
        this.layers = ko.observableArray();
    }
}

export class DatasetViewModel {
    public datasets: KnockoutObservableArray<Dataset>;
    constructor() {
        this.datasets = ko.observableArray();
    }

    loadDatasets(data: JSON) {
        $(data).each((index, item) => {
            var styles = item['fields']['test_style'];
            var dataset: Dataset;
            dataset = new Dataset(item['pk'], item['fields']['name']);
            $(styles.split(',')).each((index, item) => {
                var layer: Layer;
                layer = new Layer(item.textContent, "", 1);
                dataset.layers.push(layer);
            });
            this.datasets.push(dataset);
        });
    }
}

export class Map {
    map: L.Map;
}

export class BalticSeaMap extends Map {

    constructor(elId: string) {
        super();

        this.map = new L.Map(elId, { center: new L.LatLng(60, 27), zoom: 7 });
        var tileLayer = new L.TileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery Â© <a href="http://cloudmade.com">CloudMade</a>'
        });
        tileLayer.addTo(this.map);
    }

    createLayers(data: JSON) {
        var layersControl = new L.Control.Layers();
        $(data).each((index, item) => {
            var dsName = item['fields']['name'];
            var layers = item['fields']['test_layer'];
            var styles = item['fields']['test_style'];
            var wmsLayer = new L.TileLayer.WMS('http://geo.solab.rshu.ru:7000/wms/' + dsName + '/', {
                layers: layers,
                format: 'image/png',
                transparent: true,
                styles: styles,
                version: "1.1.1",
            });
            wmsLayer.setParams({
                /*TIME: item['fields']['test_date'],*/
                ELEVATION: '0'
            });
            layersControl.addOverlay(wmsLayer, dsName);
        });
        layersControl.addTo(this.map);
    }
}