define([
    'knockout',
    'fees/abstract-fee',
    'json!./settings.json',
    './component'
], function(ko, AbstractFee, settings) {
    var DowntownParkFee = function(params) {
        this.settings = settings;

        AbstractFee.apply(this, [params]);

        this.triggered = ko.computed(function() {
            return this.isProjectInArea() &&
                (
                    this.newOfficeGSF() >= this.newOfficeGSF
                );
        }, this);

        this.ready = ko.computed(function() {
            if (!this.triggered()) {
                return true;
            }
            return this.newOfficeGSF() !== null && this.newOfficeGSF() !== '';
        }, this);

        this.calculatedFee = ko.computed(function() {
            var newOfficeGSF = this.newOfficeGSF() || 0;
            if (!this.triggered()) {
                return 0;
            }
            return (this.feePerNewOfficeGSF * newOfficeGSF);
        }, this);
    };

    DowntownParkFee.settings = settings;

    return DowntownParkFee;
});
