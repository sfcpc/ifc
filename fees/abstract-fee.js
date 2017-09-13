define([
	'knockout',
    'underscore',
	'utils/mapserver'
], function(ko, _, mapserverUtils) {
	var AbstractFee = function(params) {
        var self = this;

        // settings, or constants to be applied for this fee
        // override with fee type specific settings BEFORE calling the super
        // constructor
        this.settings = this.settings || {};
        _.each(this.settings, function (value, key) {
            self[key] = value;
        });

        // indicates the named parameters for this fee type
        // override with fee type specific parameter names BEFORE calling the
        // super constructor (or add to settings)
        this.paramNames = this.paramNames || [];

        if (this.areaName) {
            this.areaGeom = ko.observable(null);
            mapserverUtils.getAreaGeoJSON(this.areaName, this.areaGeom);
        }

        // the string label to use in the UI for this fee type
        this.label = this.label || "";

        // fee type name (should match folder name)
        // ensure this is applied to both the prototype and instances
        this.name = this.name || AbstractFee.name;

        // the app viewmodel (will be passed in by app)
        this.app = params.app || null;

        this.trackedParamNames = [];
        this.paramNames.forEach(function(name) {
            if (self.app[name]) {
                self[name] = self.app[name];
                return;
            }
            self[name] = ko.observable(params[name] || null);
            self.trackedParamNames.push(name);
        });

        // indicates if this fee has been triggered
        // override with fee type specific triggering logic
		this.triggered = ko.computed(function() {
			return false;
		}, this);

        // indicates if this fee is ready for calculation
        // override with fee type specific logic
		this.ready = ko.computed(function() {
			return true
		}, this);

        // returns the calculated fee value
        // override with fee type specific calculation logic
		this.calculatedFee = ko.computed(function() {
			return 0;
		}, this);

        // returns the json object needed to restore the state of this viewmodel
        // this value is automatically stored in the querystring
        // this should not need to be overridden in fee types
		this.json = ko.computed(function() {
            var json = {};
            this.trackedParamNames.forEach(function(name) {
                json[name] = ko.unwrap(self[name]);
            });
			return json;
		}, this);

        // fee subtotal for use in reports;
        // this should not need to be overridden in fee types
        this.subtotal = ko.computed(function () {
            var subtotal = 0;
            var feeViewModels = this.app.feeViewModels();
            for (var i = 0; i < feeViewModels.length; i++) {
                subtotal += feeViewModels[i].calculatedFee();
                if (this === feeViewModels[i]) {
                    break;
                }
            }
            return subtotal;
        }, this);

        this.isProjectInArea = ko.computed(function () {
            if (ko.unwrap(this.geometry) && ko.unwrap(this.areaGeom)) {
                return mapserverUtils.isProjectInArea(this.geometry, this.areaGeom);
            }
            return false;
        }, this);
	};

    // name should be the same on both prototype and instances
    // (see above)
	AbstractFee.name = "";

	return AbstractFee;
});
