define([
    'knockout',
    'underscore',
    'jquery',
    'openlayers',
    "json!settings.json"
], function(ko, _, $, ol, settings) {
    var App = function(params) {
        var self = this;
        var now = new Date();
        var esrijsonFormat = new ol.format.EsriJSON();
        var geojsonFormat = new ol.format.GeoJSON();
        this.name = params.name || "";
        this.state = ko.observable(params.state || 'trigger');
        this.loading = ko.observable(false);
        this.feeViewModels = ko.observableArray();
        this.selectedFee = ko.observable();
        this.reportDate = (now.getMonth() + 1) + '/' + now.getDate() + '/' + now.getFullYear();

        this.total = ko.computed(function() {
            var total = 0;
            this.feeViewModels().forEach(function(feeViewModel) {
                if (feeViewModel.triggered()) {
                    total += feeViewModel.calculatedFee();
                }
            });
            return total;
        }, this);

        this.triggeredFeeViewModels = ko.computed(function() {
            var feeViewModels = this.feeViewModels();
            return _.filter(feeViewModels, function(feeViewModel) {
                return feeViewModel.triggered();
            });
        }, this);

        this.triggeredFeeViewModels.subscribe(function() {
            var feeViewModels = self.triggeredFeeViewModels();
            self.selectedFee(feeViewModels.length > 0 ? feeViewModels[0] : null)
        });

        this.paramNames = [
            // trigger parameters
            'geometry',
            'newUnits',
            'removedUnits',
            'newNonRes',
            'nonResGSF',
            'pdrGSF',
            'resGSF',
            'changeOfUse',
            'newOfficeGSF',

            // global fee parameters
            'newRes',
            'nonResToRes',
            'pdrToRes',
            'pdrToNonRes'
        ];

        this.paramNames.forEach(function(name) {
            self[name] = ko.observable(params[name] || null);
        });

        this.netNewUnits = ko.computed(function() {
            var newUnits = this.newUnits() || 0;
            var removedUnits = this.removedUnits() || 0;
            return newUnits - removedUnits;
        }, this);

        this.dwellingsReady = ko.computed(function() {
            var newUnits = this.newUnits();
            var removedUnits = this.removedUnits();
            return removedUnits !== null && removedUnits !== '' &&
                newUnits !== null && newUnits !== '';
        }, this);

        this.landUseReady = ko.computed(function() {
            var newNonRes = this.newNonRes();
            var nonResGSF = this.nonResGSF();
            var pdrGSF = this.pdrGSF();
            var resGSF = this.resGSF();
            var changeOfUse = this.changeOfUse();
            var newOfficeGSF = this.newOfficeGSF();
            return newNonRes !== null && newNonRes !== '' &&
                nonResGSF !== null && nonResGSF !== '' &&
                pdrGSF !== null && pdrGSF !== '' &&
                resGSF !== null && resGSF !== '' &&
                changeOfUse !== null && changeOfUse !== '' &&
                newOfficeGSF !== null && newOfficeGSF !== '';
        }, this);

        this.triggersReady = ko.computed(function() {
            return this.dwellingsReady() &&
                this.landUseReady() &&
                this.geometry();
        }, this);

        this.feesReady = ko.computed(function() {
            if (!this.triggersReady()) {
                return false;
            }
            var feeViewModels = this.feeViewModels();
            var ready = true;
            feeViewModels.forEach(function(feeViewModel) {
                if (!feeViewModel.ready()) {
                    ready = false;
                }
            });
            return ready;
        }, this);

        this.geocodeString = ko.observable('');
        this.geocodeSuccess = ko.observable(null);
        this.geocodeLoading = ko.observable(false);

        this.viewTrigger = function() {
            self.geocodeString('')
            self.state('trigger');
        };

        this.viewCalculate = function() {
            if (self.triggersReady()) {
                self.state('calculate');
            }
        };

        this.viewReport = function() {
            if (self.feesReady()) {
                self.state('report');
            }
        };

        this.geocoderIcon = ko.computed(function() {
            var success = self.geocodeSuccess();
            var icon;
            switch (success) {
                case null:
                    icon = 'fa-search';
                    break;
                case true:
                    icon = 'fa-check';
                    break;
                default:
                    icon = 'fa-times-circle shake';
            }
            if (self.geocodeLoading()) {
                icon = 'fa-spinner fa-spin';
            }
            return icon;
        });

        this.geocodeString.subscribe(function() {
            self.geocodeSuccess(null);
        });

        this.setupMap = function(olMap) {
            self.olMap = olMap;
        };

        this.geocode = function() {
            if (self.geocodeLoading()) {
                return;
            }
            if (self.geocodeSuccess() !== null) {
                self.geocodeString('');
            } else if (self.geocodeString()) {
                self.geocodeLoading(true);
                $.ajax({
                    url: settings.geocoder,
                    dataType: 'json',
                    data: {
                        search: self.geocodeString()
                    },
                    success: function(data) {
                        if (data['error']) {
                            console.error('Geocode failed: ' + data['error'].message);
                            return;
                        }
                        if (data.features && data.features.length > 0) {
                            var geom = esrijsonFormat.readGeometry(data.features[0].geometry);
                            geom.transform('EPSG:4326', 'EPSG:3857');
                            if (self.olMap) {
                                self.olMap.getView().fit(geom, self.olMap.getSize());
                            }
                            geom = geojsonFormat.writeGeometry(geom);
                            self.geometry(geom);
                            self.geocodeSuccess(true);
                        } else {
                            self.geocodeSuccess(false);
                        }
                    },
                    error: function() {
                        self.geocodeSuccess(false);
                    },
                    complete: function() {
                        self.geocodeLoading(false);
                    }
                });
            }
        };

        this.queryString = ko.computed(function() {
            var feeViewModelJSON = {};
            _.each(this.feeViewModels(), function(feeViewModel) {
                var feeJSON = feeViewModel.json();
                console.log(feeJSON);
                if (!_.isEmpty(feeJSON)) {
                    feeViewModelJSON[feeViewModel.name] = feeViewModel.json();
                }
            });
            var appJSON = {
                state: this.state(),
                fees: JSON.stringify(feeViewModelJSON)
            };
            this.paramNames.forEach(function(name) {
                appJSON[name] = ko.unwrap(self[name]);
            });
            return '?' + $.param(appJSON).split('+').join('%20');
        }, this);

        this.linkURL = ko.computed(function() {
            var queryString = this.queryString();
            return window.location.origin + window.location.pathname + queryString;
        }, this);

        this.copyModBtn = window.navigator.platform === 'MacIntel' ? 'Cmd' : 'Ctrl';
    };

    return App;
});
