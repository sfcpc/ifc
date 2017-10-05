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
                    this.officeGSF() > this.minofficeGSF
                );
        }, this);

        this.ready = ko.computed(function() {
            if (!this.triggered()) {
                return true;
            }
            return this.officeGSF() !== null && this.officeGSF() !== '';
        }, this);

        this.calculatedFee = ko.computed(function() {
            var officeGSF = this.officeGSF() || 0;
            if (!this.triggered()) {
                return 0;
            }
            return (this.feePerofficeGSF * officeGSF);
        }, this);
    };

    DowntownParkFee.settings = settings;

    return DowntownParkFee;
});
