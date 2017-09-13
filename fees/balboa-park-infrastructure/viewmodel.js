define([
	'knockout',
	'jquery',
	'fees/abstract-fee',
	'utils/mapserver',
	'json!./settings.json',
	'./component'
], function(ko, $, AbstractFee, mapserverUtils, settings) {
	var BalboaParkInfrastructureFee = function(params) {
		var self = this;
		this.paramNames = [
			'newRes',
            'newNonRes',
			'nonResToRes',
			'pdrToRes',
			'pdrToNonRes',
            'netNewUnits',
            'resGSF',
            'nonResGSF',
            'geometry'
		];

		AbstractFee.apply(this, [params]);

		this.feeTypeName = settings.name;
		this.label = settings.label;

		this.areaGeom = ko.observable(null);

		this.feePerNewRes = settings.feePerNewRes;
		this.feePerNewNonRes = settings.feePerNewNonRes;
		this.feePerNonResToRes = settings.feePerNonResToRes;
		this.feePerPDRToRes = settings.feePerPDRToRes;
		this.feePerPDRToNonRes = settings.feePerPDRToNonRes;

		mapserverUtils.getAreaGeoJSON(settings.areaName, this.areaGeom);

		this.triggered = ko.computed(function() {
			return mapserverUtils.isProjectInArea(this.geometry, this.areaGeom) &&
				(
					this.netNewUnits() >= settings.minNetNewUnits ||
					this.resGSF() >= settings.minResGSF ||
					this.newNonRes() > settings.minNewNonRes ||
					this.nonResGSF() >= settings.minNonResGSF
				);
		}, this);

		this.ready = ko.computed(function() {
			if (!this.triggered()) {
				return true;
			}
			return this.newRes() !== null && this.newRes() !== '' &&
				this.newNonRes() !== null && this.newNonRes() !== '' &&
				this.nonResToRes() !== null && this.nonResToRes() !== '' &&
				this.pdrToRes() !== null && this.pdrToRes() !== '' &&
				this.pdrToNonRes() !== null && this.pdrToNonRes() !== '';
		}, this);

		this.calculatedFee = ko.computed(function() {
			var newRes = this.newRes() || 0;
			var newNonRes = this.newNonRes() || 0;
			var nonResToRes = this.nonResToRes() || 0;
			var pdrToRes = this.pdrToRes() || 0;
			var pdrToNonRes = this.pdrToNonRes() || 0;
			if (!this.triggered()) {
				return 0;
			}
			return (this.feePerNewRes * newRes) +
				(this.feePerNewNonRes * newNonRes) +
				(this.feePerNonResToRes * nonResToRes) +
				(this.feePerPDRToRes * pdrToRes) +
				(this.feePerPDRToNonRes * pdrToNonRes);
		}, this);
	};

	BalboaParkInfrastructureFee.feeTypeName = settings.name;

	return BalboaParkInfrastructureFee;
});
