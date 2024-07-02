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
            //console.log("testing")
            if (this.resGFA() !== null && this.resGFA() !== '' &&
                this.nonResGFA() !== null && this.nonResGFA() !== '' &&
                this.nonResToRes() !== null && this.nonResToRes() !== '' &&
                this.resToNonRes() !== null && this.resToNonRes() !== '' &&
                this.pdrToRes() !== null && this.pdrToRes() !== '' &&
                this.pdrToNonRes() !== null && this.pdrToNonRes() !== '') {
                return true;
                }
            else {
                return false;
            }

        }, this);

        // calculate portion resNew by removing nonResToRes and pdrToRes from resNew
        this.resNewPortion = ko.computed(function() {
            var newPortion = parseFloat(this.resGFA()) - (
                parseFloat(this.nonResToRes()) +
                parseFloat(this.pdrToRes())
            );
            return newPortion > 0 ? newPortion : 0;
        }, this);

        this.nonResNewPortion = ko.computed(function() {
            var newPortion = parseFloat(this.nonResGFA()) - (
                parseFloat(this.pdrToNonRes()) + 
                parseFloat(this.resToNonRes())
            );
            return newPortion > 0 ? newPortion : 0;
        }, this);

        this.calculatedFee = ko.computed(function() {
            var newRes = parseFloat(this.resNewPortion()) || 0;
            var newNonRes = parseFloat(this.nonResNewPortion()) || 0;
            var nonResToRes = parseFloat(this.nonResToRes()) || 0;
            var resToNonRes = parseFloat(this.resToNonRes()) || 0;
            var pdrToRes = parseFloat(this.pdrToRes()) || 0;
            var pdrToNonRes = parseFloat(this.pdrToNonRes()) || 0;
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
