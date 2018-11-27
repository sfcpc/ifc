define([
    'knockout',
    'fees/abstract-fee',
    'json!./settings.json',
    './component'
], function(ko, AbstractFee, settings) {
    var TransportationSustainabilityFee = function(params) {
        this.settings = settings;

        AbstractFee.apply(this, [params]);

        this.triggered = ko.computed(function() {
            return false;
        }, this);

        this.ready = ko.computed(function() {
            if (!this.triggered()) {
                return true;
            }
            return false;
        }, this);

        this.calculatedFee = ko.computed(function() {
            return 0;
        }, this);
    };

    TransportationSustainabilityFee.settings = settings;

    return TransportationSustainabilityFee;
});
