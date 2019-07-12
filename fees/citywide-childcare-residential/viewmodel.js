define([
    'knockout',
    'fees/abstract-fee',
    'json!./settings.json',
    './component'
], function(ko, AbstractFee, settings) {
    var CitywideChildCareResidentialFee = function(params) {
        var self = this;
        this.settings = settings;

        AbstractFee.apply(this, [params]);

        this.triggered = ko.computed(function() {
            return (
                    this.netNewUnits() >= this.minNetNewUnits ||
                    this.resGFA() >= this.minResGFA
                );
        }, this);

        this.ready = ko.computed(function() {
            if (!this.triggered()) {
                return true;
            }
            return this.newRes() !== null && this.newRes() !== '' &&
                this.nonResToRes() !== null && this.nonResToRes() !== '' &&
                this.newConstructionCredit() !== null && this.newConstructionCredit() !== '' &&
                this.changeOfUseCredit() !== null && this.changeOfUseCredit() !== '' &&
                this.pdrToRes() !== null && this.pdrToRes() !== '';
        }, this);

        var getFeeRate = function (feeType) {
            var netNewUnits = self.netNewUnits();
            if (netNewUnits <= 9) {
                return self.lessThanOrEqualTo9[feeType];
            }
            return self.greaterThanOrEqualTo10[feeType];
        }

        this.isArticle25 = ko.computed(function() {
            return this.article25;
        }, this);

        this.feePerNonResToRes = ko.computed(function () {
            return getFeeRate('feePerNonResToRes');
        }, this);

        this.feePerPDRToRes = ko.computed(function () {
            return getFeeRate('feePerPDRToRes');
        }, this);

        this.feePerNewRes = ko.computed(function () {
            return getFeeRate('feePerNewRes');
        }, this);

        this.newConstructionFee = ko.computed(function() {
            if (!this.triggered()) {
                return 0;
            }
            var newRes = this.newRes() || 0;

            return this.feePerNewRes() * newRes;
        }, this);

        this.changeOfUseFee = ko.computed(function() {
            if (!this.triggered()) {
                return 0;
            }
            var nonResToRes = this.nonResToRes() || 0;
            var pdrToRes = this.pdrToRes() || 0;

            return (this.feePerNonResToRes() * nonResToRes) +
                (this.feePerPDRToRes() * pdrToRes);
        }, this);

        this.uncreditedFee = ko.computed(function() {
            return parseFloat(this.newConstructionFee()) + parseFloat(this.changeOfUseFee());
        }, this);

        this.feeCredit = ko.computed(function () {
            return parseFloat(this.newConstructionCredit()) + parseFloat(this.changeOfUseCredit());
        }, this);

        this.calculatedFee = ko.computed(function() {
            var feeValue = this.uncreditedFee() - this.feeCredit();
            return feeValue > 0 ? feeValue : 0;
        }, this);
    };

    CitywideChildCareResidentialFee.settings = settings;

    return CitywideChildCareResidentialFee;
});
