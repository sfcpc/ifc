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

        this.subjectGFA = ko.computed(function() {
            return parseFloat(this.hotelGFA()) +
                parseFloat(this.officeGFA());
        }, this);

        this.triggered = ko.computed(function() {
            return (
                this.subjectGFA() >= this.minNewOfficeHotelGFA
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
            var subjectGFA = this.subjectGFA();
            if (parseFloat(val) < subjectGFA) {
                this.totalProjGFA(subjectGFA);
            }
        }, this);

        this.minCcfGFARequired = ko.computed(function(){
            var subjectGFACCFReq = this.subjectGFA() * 0.1;
            return subjectGFACCFReq < this.minCcfGFA ?
                this.minCcfGFA : subjectGFACCFReq;
        }, this);

        this.subjectProjectPercentage = ko.computed(function() {
            return this.subjectGFA() / parseFloat(this.totalProjGFA());
        }, this);

        this.adequateCCF = ko.computed(function() {
            return parseFloat(this.ccfGFA()) >= this.minCcfGFARequired;
        }, this);

        this.fullInLieuFee = ko.computed(function() {
            return !this.adequateCCF() && parseFloat(this.ccfGFA()) === 0;
        }, this);

        this.calculatedFee = ko.computed(function() {
            var subjectGFA = this.subjectGFA();
            var fee = 0;
            if (!this.adequateCCF()) {
                if (this.fullInLieuFee()) {
                    // case when in 100% lieu fee is elected
                    fee = subjectGFA * this.inLieuFee;
                } else {
                    // case when combination in lieu fee and childcare is elected
                    fee = subjectGFA - (this.subjectProjectPercentage() * parseFloat(this.ccfGFA()));
                }
            }
            return fee > 0 ? fee : 0;
        }, this);
    };

    CitywideChildCareHotelOfficeFee.settings = settings;

    return CitywideChildCareHotelOfficeFee;
});
