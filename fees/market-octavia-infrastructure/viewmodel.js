define([
	'knockout',
	'jquery',
	'turf',
	'fees/abstract-fee',
	'utils/mapserver',
	'json!./settings.json',
	'./component'
], function(ko, $, turf, AbstractFee, mapserverUtils, settings) {
	var MarketOctaviaInfrastructureFee = function(params) {
		// (a)   Application. Section 421.1et seq. shall apply to any development project located in the Market and Octavia Program Area as defined in Section 401.
		// (b)   Projects subject to the Market and Octavia Community Improvement Impact Fee. The Market and Octavia Community Improvements Impact Fee is applicable to any development project in the Market and Octavia Program Area which results in:
		//    (1)   At least one net new residential unit,
		//    (2)   Additional space in an existing residential unit of more than 800 gross square feet,
		//    (3)   At least one net new group housing facility or residential care facility,
		//    (4)   Additional space in an existing group housing or residential care facility of more than 800 gross square feet,
		//    (5)   New construction of a non-residential use, or
		//    (6)   Additional non-residential space in excess of 800 gross square feet in an existing structure.
		// (c)   Fee Calculation for the Market and Octavia Community Improvement Impact Fee. For development projects for which the Market and Octavia Community Improvements Impact Fee is applicable:
		//    (1)   Any net addition of gross square feet shall pay per the Fee Schedule in Table 421.3A, and
		//    (2)   Any replacement of gross square feet or change of use shall pay per the Fee Schedule in Table 421.3B.

		// 421.3A
		// FEE SCHEDULE FOR NET ADDITIONS OF GROSS SQUARE FEET IN THE MARKET AND OCTAVIA PROGRAM AREA
		//
		// Residential
		// $9.00/gsf
		//
		// Non-residential
		// $3.40/gsf
		//
		//
		// 421.3B
		// FEE SCHEDULE FOR REPLACEMENT OF USE OR CHANGE OF USE IN THE MARKET AND OCTAVIA PROGRAM AREA
		// Residential to Residential or Non-residential; or Non-residential to Non-residential
		//

		// Residential to Residential or Non-residential; or Non-residential to Non-residential
		// $0
		//
		// Non-Residential to Residential
		// $5.60/gsf
		//
		// PDR to Residential
		// $7.30/gsf
		//
		// PDR to Non-Residential
		// $1.70/gsf

		var self = this;
		this.paramNames = [
			'newRes',
			'newNonRes',
			'nonResToRes',
			'pdrToRes',
			'pdrToNonRes'
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
				this.newNonRes() !== null && this.newNonRes() !== '' &&
				this.nonResToRes() !== null && this.nonResToRes() !== '' &&
				this.pdrToRes() !== null && this.pdrToRes() !== '' &&
				this.pdrToNonRes() !== null && this.pdrToNonRes() !== '';
		}, this);

		this.calculatedFee = ko.computed(function() {
			var newRes = this.newRes() || 0;
			var newNonRes = this.app.newNonRes() || 0;
			var nonResToRes = this.nonResToRes() || 0;
			var pdrToRes = this.pdrToRes() || 0;
			var pdrToNonRes = this.pdrToNonRes() || 0;
			if (!this.triggered()) {
				return 0;
			}
			return (this.feePerNonResToRes * newRes) +
				(this.feePerNewNonRes * newNonRes) +
				(this.feePerNonResToRes * nonResToRes) +
				(this.feePerPDRToRes * pdrToRes) +
				(this.feePerPDRToNonRes * pdrToNonRes);
		}, this);
	};

	MarketOctaviaInfrastructureFee.feeTypeName = settings.name;

	return MarketOctaviaInfrastructureFee;
});
