define([
    'knockout',
    'fees/abstract-fee',
    'json!./settings.json',
    './component'
], function(ko, AbstractFee, settings) {

    var CentralSoMaCommunityFacilitiesFee = function(params) {
        this.settings = settings;

        AbstractFee.apply(this, [params]);

        this.triggered = ko.computed(function() {
            return this.isProjectInArea() &&
                (

                    this.resGFA() >= this.minResGFA ||
                    this.newNonRes() >= this.minNewNonRes ||
                    this.nonResGFA() >= this.minNonResGFA ||
                    parseFloat(this.nonResGFA()) + parseFloat(this.resGFA()) >= this.minAllDev

                );
        }, this);

        this.ready = ko.computed(function() {
            if (!this.triggered()) {
                return true;
            }
            return this.newRes() !== null && this.newRes() !== '' &&
                this.newNonRes() !== null && this.newNonRes() !== '' &&
                this.nonResToRes() !== null && this.nonResToRes() !== '' &&
                this.resToNonRes() !== null && this.resToNonRes() !== '' &&
                this.pdrToRes() !== null && this.pdrToRes() !== '' &&
                this.pdrToNonRes() !== null && this.pdrToNonRes() !== '';
        }, this);

        this.calculatedFee = ko.computed(function() {
            var newRes = this.resGFA() || 0;
            var newNonRes = this.nonResGFA() || 0;
            var nonResToRes = this.nonResToRes() || 0;
            var resToNonRes = this.resToNonRes() || 0;
            var pdrToRes = this.pdrToRes() || 0;
            var pdrToNonRes = this.pdrToNonRes() || 0;
            if (!this.triggered()) {
                return 0;
            }
            return (this.feePerNewRes * newRes) +
                (this.feePerNewNonRes * newNonRes) +
                (this.feePerNonResToRes * nonResToRes) +
                (this.feePerResToNonRes * resToNonRes) +
                (this.feePerPDRToRes * pdrToRes) +
                (this.feePerPDRToNonRes * pdrToNonRes);
        }, this);
    };

    CentralSoMaCommunityFacilitiesFee.settings = settings;

    return CentralSoMaCommunityFacilitiesFee;
});
