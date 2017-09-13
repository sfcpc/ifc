define([
	'knockout',
	'jquery',
	'turf',
	'fees/abstract-fee',
	'utils/mapserver',
	'json!./settings.json',
	'./component'
], function(ko, $, turf, AbstractFee, mapserverUtils, settings) {
	var VanNessMarketInfrastructureFee = function(params) {
		var self = this;
		this.paramNames = [
            'geometry'
		];

		AbstractFee.apply(this, [params]);

		this.feeTypeName = settings.name;
		this.label = settings.label;

		this.areaGeom = ko.observable(null);

		mapserverUtils.getAreaGeoJSON(settings.areaName, this.areaGeom);

		this.triggered = ko.computed(function() {
			if (!this.geometry() || !this.areaGeom()) {
				return false;
			}
			var projectGeomPoints = turf.explode(JSON.parse(this.geometry()));
			var areaGeom = turf.featureCollection([
				this.areaGeom()
			]);
			var within = turf.within(
				projectGeomPoints,
				areaGeom
			);
			return within.features.length > 0;
		}, this);

		this.ready = ko.computed(function() {
			return true;
		}, this);

		this.calculatedFee = ko.computed(function() {
			return 0;
		}, this);
	};

	VanNessMarketInfrastructureFee.feeTypeName = settings.name;

	return VanNessMarketInfrastructureFee;
});
