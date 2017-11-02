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

        this.percentCcCredit.subscribe(function (val) {
            if (val < 0) {
                self.percentCcCredit(0);
            }
            if (val > 100) {
                self.percentCcCredit(100);
            }
        });

        this.triggered = ko.computed(function() {
            return (
                    this.netNewUnits() >= this.minNetNewUnits ||
                    this.resGSF() >= this.minResGSF
                );
        }, this);

        this.ready = ko.computed(function() {
            if (!this.triggered()) {
                return true;
            }
            return this.newRes() !== null && this.newRes() !== '' &&
                this.nonResToRes() !== null && this.nonResToRes() !== '' &&
                this.pdrToRes() !== null && this.pdrToRes() !== '';
        }, this);

        this.uncreditedFee = ko.computed(function() {
            var newRes = this.newRes() || 0;
            var nonResToRes = this.nonResToRes() || 0;
            var pdrToRes = this.pdrToRes() || 0;
            if (!this.triggered()) {
                return 0;
            }

            if (this.netNewUnits() <= 9) {
                this.feePerNewRes = this.lessThanOrEqualTo9.feePerNewRes;
                this.feePerNonResToRes = this.lessThanOrEqualTo9.feePerNonResToRes;
                this.feePerPDRToRes = this.lessThanOrEqualTo9.feePerPDRToRes;
            }
            else if (this.netNewUnits() >= 10) {
                this.feePerNewRes = this.greaterThanOrEqualTo10.feePerNewRes;
                this.feePerNonResToRes = this.greaterThanOrEqualTo10.feePerNonResToRes;
                this.feePerPDRToRes = this.greaterThanOrEqualTo10.feePerPDRToRes;
            }

            return (this.feePerNewRes * newRes) +
                (this.feePerNonResToRes * nonResToRes) +
                (this.feePerPDRToRes * pdrToRes);
        }, this);

        this.feeCredit = ko.computed(function () {
            return this.uncreditedFee() * (this.percentCcCredit() / 100);
        }, this);

        this.calculatedFee = ko.computed(function() {
            return this.uncreditedFee() - this.feeCredit();
        }, this);
    };

    CitywideChildCareResidentialFee.settings = settings;

    return CitywideChildCareResidentialFee;
});
