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
                this.resToNonRes() !== null && this.resToNonRes() !== '' &&
                this.resToHealth() !== null && this.resToHealth() !== '' &&
                this.resToHospital() !== null && this.resToHospital() !== '' &&
                this.hospitalToRes() !== null && this.hospitalToRes() !== '' &&
                this.hospitalToNonRes() !== null && this.hospitalToNonRes() !== '' &&
                this.hospitalToPDR() !== null && this.hospitalToPDR() !== '' &&
                this.hospitalToHealth() !== null && this.hospitalToHealth() !== '' &&
                this.healthToRes() !== null && this.healthToRes() !== '' &&
                this.healthToNonRes() !== null && this.healthToNonRes() !== '' &&
                this.healthToPDR() !== null && this.healthToPDR() !== '' &&
                this.healthToHospital() !== null && this.healthToHospital() !== '' &&
                this.pdrToRes() !== null && this.pdrToRes() !== '' &&
                this.pdrToNonRes() !== null && this.pdrToNonRes() !== '' &&
                this.pdrToHealth() !== null && this.pdrToHealth() !== '' &&
                this.pdrToHospital() !== null && this.pdrToHospital() !== '' &&
                this.newNewHospitalBeds() !== null && this.newNewHospitalBeds() !== '' &&
                this.totalHospitalOperatorBeds() !== null && this.totalHospitalOperatorBeds() !== '';
        }, this);

        this.applicableRes = ko.computed(function() {
            var applicableRes = parseFloat(this.resGFA()) +
                parseFloat(this.hospitalToRes()) +
                parseFloat(this.healthToRes()) +
                parseFloat(this.pdrToRes());
            return applicableRes;
        }, this);

        this.applicableResTier2 = ko.computed(function() {
            var totalUnits = this.totalUnits();
            var unitsAboveMin = totalUnits - this.minTier1Units;
            if (unitsAboveMin < 0) {
                return 0;
            }
            return (unitsAboveMin / totalUnits) * this.applicableRes();
        }, this);

        this.applicableResTier1 = ko.computed(function() {
            return this.applicableRes() - this.applicableResTier2();
        }, this);

        this.applicableNonRes = ko.computed(function() {
            var applicableNonRes = (
                parseFloat(this.nonResNonHealthGFA()) +
                parseFloat(this.resToNonRes()) +
                parseFloat(this.hospitalToNonRes()) +
                parseFloat(this.healthToNonRes()) +
                parseFloat(this.pdrToNonRes())
            ) - this.minNonResGFA;
            return applicableNonRes;
        }, this);

        this.applicableNonResTier1 = ko.computed(function() {
            var applicableNonRes = this.applicableNonRes();
            if (applicableNonRes <= this.minTier2NonResGFA) {
                return applicableNonRes;
            }
            return this.minTier2NonResGFA;
        }, this);

        this.applicableNonResTier2 = ko.computed(function() {
            var applicableNonRes = this.applicableNonRes() - this.minTier2NonResGFA;
            return applicableNonRes > 0 ? applicableNonRes : 0;
        }, this);

        this.applicableHospital = ko.computed(function() {
            var applicableHospital = (
                parseFloat(this.hospitalGFA()) +
                parseFloat(this.resToHospital()) +
                parseFloat(this.resToHospital()) +
                parseFloat(this.healthToHospital()) +
                parseFloat(this.healthToHospital()) +
                parseFloat(this.pdrToHospital()) +
                parseFloat(this.pdrToHospital())
            ) * (
                parseFloat(this.newNewHospitalBeds()) /
                parseFloat(this.totalHospitalOperatorBeds())
            );
            return applicableHospital;
        }, this);

        this.applicableHealth = ko.computed(function() {
            var applicableHealth = (
                parseFloat(this.healthGFA()) +
                parseFloat(this.resToHealth()) +
                parseFloat(this.hospitalToHealth()) +
                parseFloat(this.pdrToHealth())
            ) - 12000;
            return applicableHealth > 0 ? applicableHealth : 0;
        }, this);

        this.applicablePDR = ko.computed(function() {
            return parseFloat(this.pdrGFA()) +
                parseFloat(this.hospitalToPDR()) +
                parseFloat(this.healthToPDR());
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
                (this.applicablePDR() * this.pdrFee);
        }, this);
    };

    TransportationSustainabilityFee.settings = settings;

    return TransportationSustainabilityFee;
});
