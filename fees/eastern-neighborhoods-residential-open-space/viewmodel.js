define([
    'knockout',
    'fees/abstract-fee',
    'json!./settings.json',
    './component'
], function(ko, AbstractFee, settings) {
    var EasternNeighborhoodsResidentialOpenSpaceFee = function(params) {
        this.settings = settings;

        AbstractFee.apply(this, [params]);

        this.triggered = ko.computed(function() {
            return this.isProjectInArea() &&
                (
                    this.resGFA() >= this.minNewResGFA ||
                    this.finalBuildingHeight() >= this.minFinalBuildingHeight

                );
        }, this);

        this.ready = ko.computed(function() {
            if (!this.triggered()) {
                return true;
            }
            return this.openSpaceProvidedGFA() !== null && this.openSpaceProvidedGFA() !== '' &&
                this.netNewUnits !== null && this.netNewUnits !== '';
        }, this);

        this.openSpaceRequiredGFA = ko.computed(function() {
            if (this.publiclyAccessible()) {
                return this.netNewUnits() * this.openSpaceRequirement['publiclyAccessible'];
            } else {
                return this.netNewUnits() * this.openSpaceRequirement['privatelyAccessible'];
            }
        }, this);

        this.calculatedFee = ko.computed(function() {
            if (!this.triggered()) {
                return 0;
            }

            return (this.openSpaceRequiredGFA() - this.openSpaceProvidedGFA()) * this.feePerOpenSpaceGFA > 0 ? (this.openSpaceRequiredGFA() - this.openSpaceProvidedGFA()) * this.feePerOpenSpaceGFA : 0;

        }, this);
    };

    EasternNeighborhoodsResidentialOpenSpaceFee.settings = settings;

    return EasternNeighborhoodsResidentialOpenSpaceFee;
});
