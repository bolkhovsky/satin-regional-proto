/// <reference path="typings/requirejs/require.d.ts" />

require.config({
    baseUrl: "scripts/",
    paths: {
        'jquery': 'jquery-1.9.1',
        'leaflet': 'leaflet-0.6.4'
    },
    shim: {
        jquery: {
            exports: '$'
        },
        leaflet: {
            exports: 'L'
        }
    }
});

//require(['jquery', 'leaflet', 'BalticSeaMap'], ($, L, satin) => {    
//    new satin.BalticSeaMap('map');
//});

require(['jquery', 'leaflet', 'regional'], function ($, L, satin) {    
    var map = new satin.BalticSeaMap('map');
    map.loadDatasets();
});