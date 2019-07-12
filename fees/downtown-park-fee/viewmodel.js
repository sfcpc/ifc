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
                    this.officeGFA() > this.minofficeGFA
                );
        }, this);

        this.ready = ko.computed(function() {
            if (!this.triggered()) {
                return true;
            }
            return this.officeGFA() !== null && this.officeGFA() !== '';
        }, this);

        this.calculatedFee = ko.computed(function() {
            var officeGFA = this.officeGFA() || 0;
            if (!this.triggered()) {
                return 0;
            }
            return (this.feePerofficeGFA * officeGFA);
        }, this);

    };

    

    DowntownParkFee.settings = settings;

    return DowntownParkFee;
});
