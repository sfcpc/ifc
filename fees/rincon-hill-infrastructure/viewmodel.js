define([
	'knockout',
	'jquery',
	'fees/abstract-fee',
	'utils/mapserver',
	'json!./settings.json',
	'./component'
], function(ko, $, AbstractFee, mapserverUtils, settings) {
	var RinconHillInfrastructureFee = function(params) {
		this.paramNames = [
			'newRes',
			'nonResToRes',
			'pdrToRes',
            'netNewUnits',
            'resGSF',
            'geometry'
		];
        this.settings = settings;

		AbstractFee.apply(this, [params]);

		this.areaGeom = ko.observable(null);

		mapserverUtils.getAreaGeoJSON(this.areaName, this.areaGeom);

		this.triggered = ko.computed(function() {
			return mapserverUtils.isProjectInArea(this.geometry, this.areaGeom) &&
				(
					this.netNewUnits() >= this.minNetNewUnits ||
					this.resGSF() >= this.minResGSF
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

	RinconHillInfrastructureFee.name = settings.name;

	return RinconHillInfrastructureFee;
});
