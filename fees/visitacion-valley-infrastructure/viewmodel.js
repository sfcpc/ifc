define([
	'knockout',
    'jquery',
	'turf',
	'fees/abstract-fee',
    'utils/mapserver',
	'json!./settings.json',
	'./component'
], function(ko, $, turf, AbstractFee, mapserverUtils, settings) {
	var VisitacionInfrastructureFee = function(params) {
        //
        // (a)   Projects subject to the Visitacion Valley Community Facilities and Infrastructure Fee. The Visitacion Valley Community Facilities Fee and Infrastructure Fee is applicable to any development project in the Visitacion Valley Fee Area which:
        //    (1)   has 20 or more residential units, and
        //       (A)   creates at least one new residential unit, or
        //       (B)   creates additional space in an existing residential unit of more than 800 gross square feet.
        //    (2)   have both not filed an application or a building permit, site permit, conditional use, planned unit development, environmental evaluation, Zoning Map amendment or General Plan amendment prior to September 1, 2003, and have filed an application for a building permit, site permit, conditional use, planned unit development, environmental evaluation, Zoning Map amendment or General Plan amendment on or after September 1, 2003.
        // (b)   Amount of Fee. The Visitacion Valley Community Facilities and Infrastructure Fee ("Fee") shall be $4.58 for each net addition of occupiable square feet of residential use within a development project subject to this Section. Any replacement of gross square feet or change of use shall pay per the Fee Schedule in Table 420.3A below.
        //
        // 420.3A
        // FEE SCHEDULE FOR REPLACEMENT OR CHANGE OF USE IN THE RINCON HILL PROGRAM AREA
        // Residential to Residential or Non-residential;
        // Non-residential to Non-residential;
        // PDR to Non-Residential
        // $0/gsf
        //
        // Non-Residential to Residential
        // $3.60/gsf
        //
        // PDR to Residential
        // $2.32/gsf

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
                    (this.app.netNewUnits() >= settings.minNetNewUnits ||
                    this.app.resGSF() >= settings.minResGSF) &&
                    this.app.newUnits() + this.app.removedUnits() >= settings.minResidentialUnits
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
            if(!this.triggered()) {
                return 0;
            }
            return (this.feePerNewRes * newRes) +
                (this.feePerNonResToRes * nonResToRes) +
                (this.feePerPDRToRes * pdrToRes)
        }, this);

	};

	VisitacionInfrastructureFee.feeTypeName = settings.name;

	return VisitacionInfrastructureFee;
});
