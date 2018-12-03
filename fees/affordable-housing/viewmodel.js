define([
    'knockout',
    'fees/abstract-fee',
    'json!./settings.json',
    './component'
], function(ko, AbstractFee, settings) {
    var AffordableHousingFee = function(params) {
        this.settings = settings;

        AbstractFee.apply(this, [params]);

        this.triggered = ko.computed(function() {
            return this.netNewUnits() >= this.minNewUnits;
        }, this);

        this.ready = ko.computed(function() {
            if (!this.triggered()) {
                return true;
            }
            return this.ownershipType() !== null && this.ownershipType() !== '';
        }, this);

        this.applicableGFAPercentage = ko.computed(function() {
            if (this.netNewUnits() < 25) {
                return this.smallPercentage;
            } else if (this.ownershipType() === 'rental') {
                return this.largeRentalPercentage;
            }
            return this.largeOwnershipPercentage;
        }, this);

        this.applicableGFA = ko.computed(function() {
            return (
                this.applicableGFAPercentage() / 100
            ) * this.resGFA();
        }, this);

        this.calculatedFee = ko.computed(function() {
            return this.applicableGFA() * this.affordableHousingFee;
        }, this);
    };

    AffordableHousingFee.settings = settings;

    return AffordableHousingFee;
});
