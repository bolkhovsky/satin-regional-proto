/// <reference path="typings/jquery/jquery.d.ts" />
/// <reference path="typings/jqueryui/jqueryui.d.ts" />
/// <reference path="typings/leaflet/leaflet.d.ts" />
/// <reference path="typings/knockout/knockout.d.ts" />
/// <reference path="typings/requirejs/require.d.ts" />
/// <reference path="app/regional.ts" />
require.config({
    baseUrl: "content/scripts/",
    paths: {
        'jquery': 'jquery-1.9.1',
        'jqueryui': 'jquery-ui-1.10.3',
        'leaflet': 'leaflet-0.6.4',
        'knockout': 'knockout-2.3.0.debug',
        'regional': 'app/regional',
        'application': 'app/application'
    },
    shim: {
        'jqueryui': {
            deps: ['jquery']
        },
        leaflet: {
            exports: 'L'
        },
        knockout: {
            exports: 'ko'
        }
    }
});

require(['regional', 'application', 'jquery', 'leaflet', 'knockout', 'jqueryui'], function (regional, app, $, L, ko, ui) {
    ko.bindingHandlers.slider = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            var options = allBindingsAccessor().sliderOptions || {};
            $(element).slider(options);
            ko.utils.registerEventHandler(element, "slidechange", function (event, ui) {
                var observable = valueAccessor();
                observable(ui.value);
            });
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $(element).slider("destroy");
            });
            ko.utils.registerEventHandler(element, "slide", function (event, ui) {
                var observable = valueAccessor();
                observable(ui.value);
            });
        },
        update: function (element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor());
            if (isNaN(value))
                value = 0;
            $(element).slider("value", value);
        }
    };

    $.getJSON('/datasets', function (data) {
        var el = document.getElementById('datasets');
        var vm = new regional.DatasetViewModel();
        var datasets = vm.loadDatasets(data);

        ko.applyBindings(vm, el);
        $('ul:first', el).sortable();

        var map = new regional.BalticSeaMap('map');
        map.setDatasets(datasets);

        app.rebindSliders();
    });
});
//# sourceMappingURL=config.js.map
