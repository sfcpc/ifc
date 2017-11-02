define([
    'knockout',
    'fees/abstract-fee',
    'json!./settings.json',
    './component'
], function(ko, AbstractFee, settings) {
    var SomaCommunityStabilizationFee = function(params) {
        this.settings = settings;

        AbstractFee.apply(this, [params]);

        this.triggered = this.isProjectInArea;

        this.ready = ko.computed(function() {
            if (!this.triggered()) {
                return true;
            }
            return this.totalRes() !== null && this.totalRes() !== '';
        }, this);

        this.calculatedFee = ko.computed(function() {
            if (!this.triggered()) {
                return 0;
            }
            return this.feePerResGSF * this.totalRes();
        }, this);
    };

    SomaCommunityStabilizationFee.settings = settings;

    return SomaCommunityStabilizationFee;
});
