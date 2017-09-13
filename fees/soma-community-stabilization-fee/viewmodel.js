define([
	'knockout',
	'jquery',
	'fees/abstract-fee',
	'utils/mapserver',
	'json!./settings.json',
	'./component'
], function(ko, $, AbstractFee, mapserverUtils, settings) {
	var SomaCommunityStabilizationFee = function(params) {
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
			return mapserverUtils.isProjectInArea(this.geometry, this.areaGeom);
		}, this);

		this.ready = ko.computed(function() {
			return true;
		}, this);

		this.calculatedFee = ko.computed(function() {
			return 0;
		}, this);
	};

	SomaCommunityStabilizationFee.feeTypeName = settings.name;

	return SomaCommunityStabilizationFee;
});
