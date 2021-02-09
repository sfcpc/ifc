define([
    'knockout',
    'underscore',
    'fees/abstract-fee',
    'json!./settings.json',
    './component'
], function(ko, _, AbstractFee, settings) {
    var VanNessMarketCommunityFacilityFee = function(params) {
        this.settings = settings;

        AbstractFee.apply(this, [params]);

        this.triggered = ko.computed(function() {
            return this.isProjectInArea() &&
                this.resGFA() >= this.minResGFA;
        }, this);

        this.ready = ko.computed(function() {
            if (!this.triggered()) {
                return true;
            }
            return this.resGFA() !== null && this.resGFA() !== '';
        }, this);

        this.calculatedFee = ko.computed(function() {
            var fee = 0;
            if (this.triggered() && this.resGFA() >= 800) {
                fee = this.resGFA() * this.feePerNewRes;
            }
            return fee;
        }, this);
    };

    VanNessMarketCommunityFacilityFee.settings = settings;

    return VanNessMarketCommunityFacilityFee;
});
