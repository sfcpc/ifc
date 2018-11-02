define([
    'knockout',
    'fees/abstract-fee',
    'json!./settings.json',
    './component'
], function(ko, AbstractFee, settings) {
    var DowntownSpecialDevelopmentDistrictOpenSpaceFee = function(params) {
        this.settings = settings;

        AbstractFee.apply(this, [params]);

        this.triggered = ko.computed(function() {
            return this.isProjectInArea() &&
                (
                    this.newNonRes()/this.totalExistingGFA() >= .2 ||
                    this.nonResGFA()/this.totalExistingGFA() >= .2 ||
                    this.pdrGFA()/this.totalExistingGFA() >= .2 ||
                    this.resGFA()/this.totalExistingGFA() >= .2 ||
                    this.officeGFA()/this.totalExistingGFA() >= .2 ||
                    this.hotelGFA()/this.totalExistingGFA() >= .2
                );
        }, this);

        this.ready = ko.computed(function() {
            if (!this.triggered()) {
                return true;
            }
            return this.newNonRes() !== null && this.newNonRes() !== '' &&
                this.nonResGFA() !== null && this.nonResGFA() !== '' &&
                this.pdrGFA() !== null && this.pdrGFA() !== '' &&
                this.resGFA() !== null && this.resGFA() !== '' &&
                this.officeGFA() !== null && this.officeGFA() !== '' &&
                this.hotelGFA() !== null && this.hotelGFA() !== '' &&
                this.totalExistingGFA() !== null && this.totalExistingGFA() !== '' &&
                this.openSpaceProvidedGFA() !== null && this.openSpaceProvidedGFA() !== '';
        }, this);

        this.openSpaceRequiredGFA = ko.computed(function() {
            return (this.newNonRes() + this.nonResGFA() + this.pdrGFA() + this.resGFA() + this.officeGFA() + this.hotelGFA())/this.openSpaceRequirementPerFoot > 0 ? (this.newNonRes() + this.nonResGFA() + this.pdrGFA() + this.resGFA() + this.officeGFA() + this.hotelGFA())/this.openSpaceRequirementPerFoot : 0;
        }, this);

        this.calculatedFee = ko.computed(function() {
            if (!this.triggered()) {
                return 0;
            }

            return (this.openSpaceRequiredGFA() - this.openSpaceProvidedGFA()) * this.feePerOpenSpaceGFA > 0 ? (this.openSpaceRequiredGFA() - this.openSpaceProvidedGFA()) * this.feePerOpenSpaceGFA : 0;

        }, this);
    };

    DowntownSpecialDevelopmentDistrictOpenSpaceFee.settings = settings;

    return DowntownSpecialDevelopmentDistrictOpenSpaceFee;
});
