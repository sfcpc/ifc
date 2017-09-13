define([
	'knockout',
	'jquery',
	'turf',
	'fees/abstract-fee',
	'utils/mapserver',
	'json!./settings.json',
	'./component'
], function(ko, $, turf, AbstractFee, mapserverUtils, settings) {
	var RinconHillInfrastructureFee = function(params) {
		this.paramNames = [
			'newRes',
			'nonResToRes',
			'pdrToRes'
		];

		AbstractFee.apply(this, [params]);

		this.feeTypeName = settings.name;
		this.label = settings.label;
		this.value = ko.observable(params.value || null);

		this.areaGeom = ko.observable(null);

		this.feePerNewRes = settings.feePerNewRes;
		this.feePerNonResToRes = settings.feePerNonResToRes;
		this.feePerPDRToRes = settings.feePerPDRToRes;

		mapserverUtils.getAreaGeoJSON(settings.areaName, this.areaGeom);

		this.triggered = ko.computed(function() {
			if (!this.app.geometry() || !this.areaGeom()) {
				return false;
			}
			var projectGeomPoints = turf.explode(JSON.parse(this.app.geometry()));
			var areaGeom = turf.featureCollection([
				this.areaGeom()
			]);
			var within = turf.within(
				projectGeomPoints,
				areaGeom
			);
			return within.features.length > 0 &&
				(
					this.app.netNewUnits() >= settings.minNetNewUnits ||
					this.app.resGSF() >= settings.minResGSF
				);
		}, this);

		this.ready = ko.computed(function() {
			if (!this.triggered()) {
				return true;
			}
			return this.newRes() !== null && this.newRes() !== '' &&
				this.nonResToRes() !== null && this.nonResToRes() !== '' &&
				this.pdrToRes() !== null && this.pdrToRes() !== ''
		}, this);

		this.calculatedFee = ko.computed(function() {
			var newRes = this.newRes() || 0;
			var nonResToRes = this.nonResToRes() || 0;
			var pdrToRes = this.pdrToRes() || 0;
			if (!this.triggered()) {
				return 0;
			}
			return (this.feePerNewRes * newRes) +
				(this.feePerNonResToRes * nonResToRes) +
				(this.feePerPDRToRes * pdrToRes)
		}, this);

	};

	RinconHillInfrastructureFee.feeTypeName = settings.name;

	return RinconHillInfrastructureFee;
});
