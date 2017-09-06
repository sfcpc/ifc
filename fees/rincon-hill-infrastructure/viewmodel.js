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

        // (b)   Projects subject to the Rincon Hill Community Infrastructure Impact Fee. The Rincon Hill Community Infrastructure Impact Fee is applicable to any development project in the Rincon Hill Program Area which results in:
        //    (1)   At least one net new residential unit,
        //    (2)   Additional space in an existing residential unit of more than 800 gross square feet,
        //    (3)   At least one net new group housing facility or residential care facility,
        //    (4)   Additional space in an existing group housing or residential care facility of more than 800 gross square feet,
        // (c)   Fee Calculation for the Rincon Hill Community Infrastructure Impact Fee. For development projects for which the Rincon Hill Community Infrastructure Impact Fee is applicable:
        //    (1)   Any net addition of gross square feet shall pay per the Fee Schedule in Table 418.3A, and
        //    (2)   Any replacement of gross square feet or change of use shall pay per the Fee Schedule in Table 418.3B.
        //
        // 413.3A
        // FEE SCHEDULE FOR NET ADDITIONS OF GROSS SQUARE FEET IN THE RINCON HILL PROGRAM AREA:
        // Residential $8.60/gsf
        //
        // 418.3B
        // FEE SCHEDULE FOR REPLACEMENT OR CHANGE OF USE IN THE RINCON HILL PROGRAM AREA
        // Residential to Residential or Non-residential;
        // Non-residential to Non-residential;
        // PDR to Non-Residential
        // $0/gsf
        //
        // Non-Residential to Residential
        // $5.00/gsf
        //
        // PDR to Residential
        // $6.80/gsf

		AbstractFee.apply(this, [params]);

		this.feeTypeName = settings.name;
		this.label = settings.label;
		this.value = ko.observable(params.value || null);

        this.areaGeom = ko.observable(null);

        this.newRes = ko.observable(params.newRes || null);
        this.nonResToRes = ko.observable(params.nonResToRes || null);
        this.pdrToRes = ko.observable(params.pdrToRes || null);

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
            if(!this.triggered()) {
                return 0;
            }
            return (this.feePerNewRes * newRes) +
                (this.feePerNonResToRes * nonResToRes) +
                (this.feePerPDRToRes * pdrToRes)
        }, this);

        this.json = ko.computed(function() {
            return {
                "newRes": this.newRes(),
                "nonResToRes": this.nonResToRes(),
                "pdrToRes": this.pdrToRes()
            };
        }, this);

	};

	RinconHillInfrastructureFee.feeTypeName = settings.name;

	return RinconHillInfrastructureFee;
});
