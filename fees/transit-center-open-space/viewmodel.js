define([
    'knockout',
    'underscore',
    'fees/abstract-fee',
    'json!./settings.json',
    './component'
], function(ko, _, AbstractFee, settings) {
    var TransitCenterOpenSpaceFee = function(params) {
        this.settings = settings;

        AbstractFee.apply(this, [params]);

        this.triggered = ko.computed(function() {
            return false;
        }, this);

        this.ready = ko.computed(function() {
            return true;
        }, this);

        this.calculatedFee = ko.computed(function() {
            return 0;
        }, this);
    };

    TransitCenterOpenSpaceFee.settings = settings;

    return TransitCenterOpenSpaceFee;
});
