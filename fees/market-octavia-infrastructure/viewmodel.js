define([
	'knockout',
	'fees/abstract-fee',
	'json!./settings.json',
	'./component'
], function(ko, AbstractFee, settings) {

    var MarketOctaviaInfrastructureFee = function(params) {

    //(a)   Application. Section 421.1et seq. shall apply to any development project located in the Market and Octavia Program Area as defined in Section 401.
    //(b)   Projects subject to the Market and Octavia Community Improvement Impact Fee. The Market and Octavia Community Improvements Impact Fee is applicable to any development project in the Market and Octavia Program Area which results in:
    //    (1)   At least one net new residential unit,
    //    (2)   Additional space in an existing residential unit of more than 800 gross square feet,
    //    (3)   At least one net new group housing facility or residential care facility,
    //    (4)   Additional space in an existing group housing or residential care facility of more than 800 gross square feet,
    //    (5)   New construction of a non-residential use, or
    //    (6)   Additional non-residential space in excess of 800 gross square feet in an existing structure.
    //(c)   Fee Calculation for the Market and Octavia Community Improvement Impact Fee. For development projects for which the Market and Octavia Community Improvements Impact Fee is applicable:
    //    (1)   Any net addition of gross square feet shall pay per the Fee Schedule in Table 421.3A, and
    //    (2)   Any replacement of gross square feet or change of use shall pay per the Fee Schedule in Table 421.3B.
    //
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
    // Non-Residential to Residential
    // $0
    //
    // PDR to Residential
    // $5.60/gsf
    //
    // PDR to
    // $7.30/gsf
    //
    // Non-Residential
    // $1.70/gsf



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

    MarketOctaviaInfrastructureFee.feeTypeName = settings.name;

    return MarketOctaviaInfrastructureFee;


});
