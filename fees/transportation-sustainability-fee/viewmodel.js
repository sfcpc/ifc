define([
    'knockout',
    'fees/abstract-fee',
    'json!./settings.json',
    './component'
], function(ko, AbstractFee, settings) {
    var TransportationSustainabilityFee = function(params) {
        this.settings = settings;

        AbstractFee.apply(this, [params]);

        this.triggered = ko.computed(function() {
            return this.totalUnits() >= this.minTotalUnits ||
                this.resGFA() >= this.minResGFA ||
                this.nonResGFA() >= this.minNonResGFA ||
                this.pdrGFA() >= this.minPDRGFA ||
                this.changeOfUse() > this.minChangeOfUse;
        }, this);

        this.ready = ko.computed(function() {
            if (!this.triggered() || this.exemptFromTSF()) {
                return true;
            }
            return this.nonResNonHealthGFA() !== null && this.nonResNonHealthGFA() !== '' &&
                this.hospitalGFA() !== null && this.hospitalGFA() !== '' &&
                this.healthGFA() !== null && this.healthGFA() !== '' &&
                this.newNewHospitalBeds() !== null && this.newNewHospitalBeds() !== '' &&
                this.totalHospitalOperatorBeds() !== null && this.totalHospitalOperatorBeds() !== '';
        }, this);

        this.isArticle25 = ko.computed(function() {
            return this.article25;
        }, this);

        this.applicableResTier2 = ko.computed(function() {
            var totalUnits = this.totalUnits();
            var unitsAboveMin = totalUnits - this.minTier1Units;
            if (unitsAboveMin < 0) {
                return 0;
            }
            return (unitsAboveMin / totalUnits) * this.resGFA();
        }, this);

        this.applicableResTier1 = ko.computed(function() {
            return this.resGFA() - this.applicableResTier2();
        }, this);

        this.applicableNonResTier1 = ko.computed(function() {
            var applicableNonRes = this.nonResNonHealthGFA();
            if (applicableNonRes <= this.minTier2NonResGFA) {
                return applicableNonRes;
            }
            return this.minTier2NonResGFA;
        }, this);

        this.applicableNonResTier2 = ko.computed(function() {
            var applicableNonRes = this.nonResNonHealthGFA() - this.minTier2NonResGFA;
            return applicableNonRes > 0 ? applicableNonRes : 0;
        }, this);

        this.applicableHospital = ko.computed(function() {
            var applicableHospital = parseFloat(this.hospitalGFA()) * (
                parseFloat(this.newNewHospitalBeds()) /
                (parseFloat(this.totalHospitalOperatorBeds()) || 1)
            );
            return applicableHospital;
        }, this);

        this.applicableHealth = ko.computed(function() {
            var applicableHealth = parseFloat(this.healthGFA()) - 12000;
            return applicableHealth > 0 ? applicableHealth : 0;
        }, this);

        this.calculatedFee = ko.computed(function() {
            if (this.exemptFromTSF()) {
                return 0;
            }
            return (this.applicableResTier1() * this.resTier1Fee) +
                (this.applicableResTier2() * this.resTier2Fee) +
                (this.applicableNonResTier1() * this.nonResTier1Fee) +
                (this.applicableNonResTier2() * this.nonResTier2Fee) +
                (this.applicableHospital() * this.hospitalFee) +
                (this.applicableHealth() * this.healthFee) +
                (this.pdrGFA() * this.pdrFee);
        }, this);
    };

    TransportationSustainabilityFee.settings = settings;

    return TransportationSustainabilityFee;
});
