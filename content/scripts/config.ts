/// <reference path="typings/jquery/jquery.d.ts" />
/// <reference path="typings/leaflet/leaflet.d.ts" />
/// <reference path="typings/knockout/knockout.d.ts" />
/// <reference path="typings/requirejs/require.d.ts" />
/// <reference path="app/regional.ts" />

require.config({
    baseUrl: "content/scripts/",
    paths: {
        'jquery': 'jquery-1.9.1',
        'leaflet': 'leaflet-0.6.4',
        'knockout': 'knockout-2.3.0.debug',
        'regional': 'app/regional'
    },
    shim: {
        jquery: {
            exports: '$'
        },
        leaflet: {
            exports: 'L'
        },
        knockout: {
            exports: 'ko'
        },
    }
});

require(['regional', 'jquery', 'leaflet', 'knockout'], function (regional, $: JQueryStatic, L, ko: KnockoutStatic) {    
    $.getJSON('/datasets', (data: JSON) => {
        var map = new regional.BalticSeaMap('map');
        map.createLayers(data);

        var el = document.getElementById('datasets');
        var vm = new regional.DatasetViewModel();
        vm.loadDatasets(data);
        ko.applyBindings(vm, el);
    });
});