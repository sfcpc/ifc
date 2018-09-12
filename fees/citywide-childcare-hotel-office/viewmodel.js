define([
    'knockout',
    'fees/abstract-fee',
    'json!./settings.json',
    './component'
], function(ko, AbstractFee, settings) {
    var CitywideChildCareHotelOfficeFee = function(params) {
        var self = this;
        this.settings = settings;

        AbstractFee.apply(this, [params]);

        this.triggered = ko.computed(function() {
            return (
                    parseFloat(this.officeGFA()) + parseFloat(this.hotelGFA()) >= this.minNewOfficeHotelGFA
                );
        }, this);

        this.ready = ko.computed(function() {
            if (!this.triggered()) {
                return true;
            }
            return this.ccfGFA() !== null && this.ccfGFA() !== '' &&
                this.minCcfGFARequired() !== null && this.minCcfGFARequired() !== '' &&
                this.totalProjGFA() !== null && this.totalProjGFA() !== '';
        }, this);

        this.totalProjGFA.subscribe(function(val) {
            if (parseFloat(val) < (parseFloat(this.hotelGFA()) + parseFloat(this.officeGFA()))) {
                val = (parseFloat(this.hotelGFA()) + parseFloat(this.officeGFA()));
            }
            this.totalProjGFA(parseFloat(val));
        }, this)

        this.minCcfGFARequired = ko.computed(function(){
            return ((parseFloat(this.officeGFA()) + parseFloat(this.hotelGFA())) * 0.1) < this.minCcfGFA ? this.minCcfGFA : ((parseFloat(this.officeGFA()) + parseFloat(this.hotelGFA())) * 0.1)
        }, this);

        this.subjectProjectPercentage = ko.computed(function() {
            return (parseFloat(this.officeGFA()) + parseFloat(this.hotelGFA()))/this.totalProjGFA()
        }, this);

        this.calculatedFee = ko.computed(function() {
            if (parseFloat(this.ccfGFA()) >= this.minCcfGFARequired) {
                // case when adequate childcare facility has been constructed
                return 0
            }
            else if (parseFloat(this.ccfGFA()) === 0) {
                // case when in 100% lieu fee is elected
                return (parseFloat(this.officeGFA()) + parseFloat(this.hotelGFA()) * this.inLieuFee)
            }
            else {
                // case when combination in lieu fee and childcare is elected
                return parseFloat((parseFloat(this.hotelGFA()) + parseFloat(this.officeGFA()))) - (parseFloat(this.subjectProjectPercentage()) * parseFloat(this.ccfGFA()))
            }

        }, this);
    };

    CitywideChildCareHotelOfficeFee.settings = settings;

    return CitywideChildCareHotelOfficeFee;
});
