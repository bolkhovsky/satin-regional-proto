/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/leaflet/leaflet.d.ts" />
/// <reference path="../typings/knockout/knockout.d.ts" />

export class Layer {
    name: string;
    style: KnockoutObservable<string>;
    opacity: KnockoutObservable<number>;
    isChecked: KnockoutObservable<boolean>;
    map: L.Map;
    wmsLayer: any;

    constructor(name: string, style: string, opacity: number) {
        this.name = name;
        this.style = ko.observable(style);
        this.opacity = ko.observable(opacity);
        this.opacity.subscribe((val) => {
            if (this.wmsLayer != null) {
                var opacity = val / 10;
                this.wmsLayer.setOpacity(opacity);
            }
        });
        this.isChecked = ko.observable(false);
        this.isChecked.subscribe((val) => {
            console.log('eeee');
        });
    }

    toggle() {
        if (this.map.hasLayer(this.wmsLayer)) {
            console.log('remove layer');
            this.map.removeLayer(this.wmsLayer);
        } else {
            console.log('add layer');
            this.map.addLayer(this.wmsLayer);
        }
        return true;
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
            var dataset: Dataset;
            dataset = new Dataset(item['pk'], item['fields']['name']);
            $(item['fields']['test_layer'].split(',')).each((index, lr) => {
                var layer: Layer;
                layer = new Layer(lr.toString(), item['fields']['test_style'], 1);                
                dataset.layers.push(layer);
            });
            this.datasets.push(dataset);
        });
        return this.datasets;        
    }
}

export class BaseMap {
    map: L.Map;

    constructor(id: string, options?: L.MapOptions) {
        this.map = new L.Map(id, options);
    }
}

export class BalticSeaMap extends BaseMap {
    constructor(elId: string) {
        super(elId, { center: new L.LatLng(60, 27), zoom: 7 });
        var tileLayer = new L.TileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery Â© <a href="http://cloudmade.com">CloudMade</a>'
        });
        tileLayer.addTo(this.map);
    }

    setDatasets(datasets: KnockoutObservableArray<Dataset>) {
        for (var i = 0; i < datasets().length; i++) {
            var dataset: Dataset;
            dataset = datasets()[i];
            for (var j = 0; j < dataset.layers().length; j++) {
                var layer: Layer;
                layer = dataset.layers()[j];
                layer.wmsLayer = new L.TileLayer.WMS('http://geo.solab.rshu.ru:7000/wms/' + dataset.name + '/', {
                    layers: layer.name,
                    format: 'image/png',
                    transparent: true,
                    styles: layer.style.peek(),
                    version: "1.1.1",
                });
                layer.wmsLayer.setParams({
                    ELEVATION: '0'
                });
                layer.wmsLayer.setOpacity(layer.opacity.peek());
                layer.map = this.map;
            }
        }
    }
}