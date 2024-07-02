define([
    'knockout',
    'fees/abstract-fee',
    'json!./settings.json',
    './component'
], function(ko, AbstractFee, settings) {
    var RinconHillInfrastructureFee = function(params) {
        this.settings = settings;

        AbstractFee.apply(this, [params]);

        this.triggered = ko.computed(function() {
            return this.isProjectInArea() &&
                (
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
                this.pdrToRes() !== null && this.pdrToRes() !== ''
        }, this);

        // calculate portion resNew by removing nonResToRes and pdrToRes from resNew
         this.resNewPortion = ko.computed(function() {
            var newPortion = parseFloat(this.newRes()) - (
                parseFloat(this.nonResToRes()) +
                parseFloat(this.pdrToRes())
            );
            return newPortion > 0 ? newPortion : 0;
        }, this);

        this.calculatedFee = ko.computed(function() {
            var newRes = this.resNewPortion() || 0;
            var nonResToRes = this.nonResToRes() || 0;
            var pdrToRes = this.pdrToRes() || 0;
            if (!this.triggered()) {
                return 0;
            }
            return (this.feePerNewRes * newRes) +
                (this.feePerNonResToRes * nonResToRes) +
                (this.feePerPDRToRes * pdrToRes)
        }, this);

    };

    RinconHillInfrastructureFee.settings = settings;

    return RinconHillInfrastructureFee;
});
