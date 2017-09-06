define([
	'knockout',
	'fees/abstract-fee',
	'json!./settings.json',
	'./component'
], function(ko, AbstractFee, settings) {
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
		this.multiplier = settings.multiplier;

		this.triggered = ko.computed(function() {
			return this.app.netNewUnits() >= settings.minNetNewUnits;
		}, this);

		this.ready = ko.computed(function() {
			if (!this.triggered()) {
				return true;
			}
			return this.value();
		}, this);

		this.calculatedFee = ko.computed(function() {
			var val = this.value();
			return val && this.triggered() ? val * this.multiplier : 0;
		}, this);

		this.json = ko.computed(function() {
			return {
				"value": this.value()
			};
		}, this);
	};

	RinconHillInfrastructureFee.feeTypeName = settings.name;

	return RinconHillInfrastructureFee;
});
