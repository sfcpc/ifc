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
            var openSpaceProvidedGFA = this.openSpaceProvidedGFA();
            return openSpaceProvidedGFA !== null && openSpaceProvidedGFA !== '';
        }, this);

        this.openSpaceRequiredGFA = ko.computed(function() {
            if (this.publiclyAccessible()) {
                return this.netNewUnits() * this.publicOpenSpaceRequirement;
            } else {
                return this.netNewUnits() * this.privateOpenSpaceRequirement;
            }
        }, this);

        this.calculatedFee = ko.computed(function() {
            if (!this.triggered()) {
                return 0;
            }

            var fee = (
                this.openSpaceRequiredGFA() - this.openSpaceProvidedGFA()
            ) * this.feePerOpenSpaceGFA;

            return fee > 0 ? fee : 0;

        }, this);
    };

    EasternNeighborhoodsResidentialOpenSpaceFee.settings = settings;

    return EasternNeighborhoodsResidentialOpenSpaceFee;
});
