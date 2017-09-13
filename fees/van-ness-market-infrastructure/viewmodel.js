define([
	'knockout',
	'jquery',
	'fees/abstract-fee',
	'utils/mapserver',
	'json!./settings.json',
	'./component'
], function(ko, $, AbstractFee, mapserverUtils, settings) {
	var VanNessMarketInfrastructureFee = function(params) {
		var self = this;
		this.paramNames = [
            'geometry'
		];
        this.settings = settings;

		AbstractFee.apply(this, [params]);

		this.areaGeom = ko.observable(null);

		mapserverUtils.getAreaGeoJSON(this.areaName, this.areaGeom);

		this.triggered = ko.computed(function() {
			return mapserverUtils.isProjectInArea(this.geometry, this.areaGeom);
		}, this);

		this.ready = ko.computed(function() {
			return true;
		}, this);

		this.calculatedFee = ko.computed(function() {
			return 0;
		}, this);
	};

	VanNessMarketInfrastructureFee.name = settings.name;

	return VanNessMarketInfrastructureFee;
});
