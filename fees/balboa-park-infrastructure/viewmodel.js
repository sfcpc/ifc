define([
	'knockout',
	'jquery',
	'turf',
	'fees/abstract-fee',
	'utils/mapserver',
	'json!./settings.json',
	'./component'
], function(ko, $, turf, AbstractFee, mapserverUtils, settings) {
	var BalboaParkInfrastructureFee = function(params) {
		var self = this;
		AbstractFee.apply(this, [params]);

		this.feeTypeName = settings.name;
		this.label = settings.label;

		this.areaGeom = ko.observable(null);

        this.newRes = ko.observable(params.newRes || null);
        this.nonResToRes = ko.observable(params.nonResToRes || null);
        this.pdrToRes = ko.observable(params.pdrToRes || null);
        this.pdrToNonRes = ko.observable(params.pdrToNonRes || null);

        this.feePerNewRes = settings.feePerNewRes;
        this.feePerNewNonRes = settings.feePerNewNonRes;
        this.feePerNonResToRes = settings.feePerNonResToRes;
        this.feePerPDRToRes = settings.feePerPDRToRes;
        this.feePerPDRToNonRes = settings.feePerPDRToNonRes;

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
                    this.app.resGSF() >= settings.minResGSF ||
                    this.app.newNonRes() > settings.minNewNonRes ||
                    this.app.nonResGSF() >= settings.minNonResGSF
                );
		}, this);

        this.ready = ko.computed(function() {
            if (!this.triggered()) {
                return true;
            }
            return this.newRes() !== null && this.newRes() !== '' &&
                this.nonResToRes() !== null && this.nonResToRes() !== '' &&
                this.pdrToRes() !== null && this.pdrToRes() !== '' &&
                this.pdrToNonRes() !== null && this.pdrToNonRes() !== '';
        }, this);

        this.json = ko.computed(function() {
            return {
                "newRes": this.newRes(),
                "nonResToRes": this.nonResToRes(),
                "pdrToRes": this.pdrToRes(),
                "pdrToNonRes": this.pdrToNonRes()
            };
        }, this);

        this.calculatedFee = ko.computed(function() {
            var newRes = this.newRes() || 0;
            var newNonRes = this.app.newNonRes() || 0;
            var nonResToRes = this.nonResToRes() || 0;
            var pdrToRes = this.pdrToRes() || 0;
            var pdrToNonRes = this.pdrToNonRes() || 0;
            if(!this.triggered()) {
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
