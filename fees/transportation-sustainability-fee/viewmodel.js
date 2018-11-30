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
            return this.netNewUnits() >= this.minNetNewUnits ||
                this.resGFA() >= this.minResGFA ||
                this.nonResGFA() >= this.minNonResGFA ||
                this.pdrGFA() >= this.minPDRGFA ||
                this.changeOfUse() > this.minChangeOfUse;
        }, this);

        this.ready = ko.computed(function() {
            if (!this.triggered()) {
                return true;
            }
            return this.hospitalGFA() !== null && this.hospitalGFA() !== '' &&
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

        this.calculatedFee = ko.computed(function() {
            return 0;
        }, this);
    };

    TransportationSustainabilityFee.settings = settings;

    return TransportationSustainabilityFee;
});
