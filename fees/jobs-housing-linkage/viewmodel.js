define([
    'knockout',
    'fees/abstract-fee',
    'json!./settings.json',
    './component'
], function(ko, AbstractFee, settings) {
    var JobsHousingLinkageFee = function(params) {
        var self = this;
        this.settings = settings;

        AbstractFee.apply(this, [params]);

        this.triggered = ko.computed(function() {
            return (
                    this.newNonRes() + this.nonResGFA() >= this.minNonResGFA
                );
        }, this);

        this.ready = ko.computed(function() {
            if (!this.triggered()) {
                return true;
            }
            return this.newEnt() !== null && this.newEnt() !== '' &&
                this.newHotel() !== null && this.newHotel() !== '' &&
                this.newIntegratedPDR() !== null && this.newIntegratedPDR() !== '' &&
                this.newOffice() !== null && this.newOffice() !== '' &&
                this.newResearchAndDevelopment() !== null && this.newResearchAndDevelopment() !== '' &&
                this.newRetail() !== null && this.newRetail() !== '' &&
                this.newSmallEnterpriseWorkspace() !== null && this.newSmallEnterpriseWorkspace() !== '';
            return this.feeCredit() !== null && this.feeCredit() !== '';
        }, this);

        this.uncreditedFee = ko.computed(function() {
            if (!this.triggered()) {
                return 0;
            }
            var newEnt = this.newEnt() || 0;
            var newHotel = this.newHotel() || 0;
            var newIntegratedPDR = this.newIntegratedPDR() || 0;
            var newOffice = this.newOffice() || 0;
            var newResearchAndDevelopment = this.newResearchAndDevelopment() || 0;
            var newRetail = this.newRetail() || 0;
            var newSmallEnterpriseWorkspace = this.newSmallEnterpriseWorkspace() || 0;

            return (this.feePerNewEntertainment * newEnt) +
                   (this.feePerNewHotel * newHotel) +
                   (this.feePerNewIntegratedPDR * newIntegratedPDR) +
                   (this.feePerNewOffice * newOffice) +
                   (this.feePerNewResearchAndDevelopment * newResearchAndDevelopment) +
                   (this.feePerNewRetail * newRetail) +
                   (this.feePerNewSmallEnterpriseWorkspace * newSmallEnterpriseWorkspace);
        }, this);

        this.calculatedFee = ko.computed(function() {
            var feeValue = this.uncreditedFee() - this.feeCredit();
            return feeValue > 0 ? feeValue : 0;
        }, this);
    };

    JobsHousingLinkageFee.settings = settings;

    return JobsHousingLinkageFee;
});
