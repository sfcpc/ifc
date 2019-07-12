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
            var openSpaceGFAShortfall = this.openSpaceGFAShortfall();
            return openSpaceGFAShortfall !== null && openSpaceGFAShortfall !== '';
        }, this);

        this.isArticle25 = ko.computed(function() {
            return this.article25;
        }, this);

        this.calculatedFee = ko.computed(function() {
            if (!this.triggered()) {
                return 0;
            }

            var fee = this.openSpaceGFAShortfall() * this.feePerOpenSpaceGFA;
            return fee > 0 ? fee : 0;
        }, this);
    };

    EasternNeighborhoodsResidentialOpenSpaceFee.settings = settings;

    return EasternNeighborhoodsResidentialOpenSpaceFee;
});
