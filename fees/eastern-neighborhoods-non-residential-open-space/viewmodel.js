define([
    'knockout',
    'fees/abstract-fee',
    'json!./settings.json',
    './component'
], function(ko, AbstractFee, settings) {
    var EasternNeighborhoodsNonResidentialOpenSpaceFee = function(params) {
        this.settings = settings;

        AbstractFee.apply(this, [params]);

        this.triggered = ko.computed(function() {
            return this.isProjectInArea() &&
                (
                    this.newNonRes() > 0 ||
                    this.newNonRes()/this.existingNonResGFA() >= .2 ||
                    this.nonResGFA()/this.existingNonResGFA() >= .2 ||
                    this.officeGFA()/this.existingNonResGFA() >= .2
                );
        }, this);

        this.ready = ko.computed(function() {
            if (!this.triggered()) {
                return true;
            }
            return this.retailOpenSpaceGFAShortfall() !== null && this.retailOpenSpaceGFAShortfall() !== '' &&
                this.manufacturingOpenSpaceGFAShortfall() !== null && this.manufacturingOpenSpaceGFAShortfall() !== '' &&
                this.officeOpenSpaceGFAShortfall() !== null && this.officeOpenSpaceGFAShortfall() !== '' &&
                this.otherOpenSpaceGFAShortfall() !== null && this.otherOpenSpaceGFAShortfall() !== '';
        }, this);

        this.calculateFee = function(openSpaceShortfall) {
            var fee = openSpaceShortfall*this.feePerOpenSpaceGFA;
            return  fee > 0 ? fee : 0;
        };

        this.retailFee = ko.computed(function() {
            return this.calculateFee(this.retailOpenSpaceGFAShortfall());
        }, this);

        this.manufacturingFee = ko.computed(function() {
            return this.calculateFee(this.manufacturingOpenSpaceGFAShortfall());
        }, this);

        this.officeFee = ko.computed(function() {
            return this.calculateFee(this.officeOpenSpaceGFAShortfall());
        }, this);

        this.otherFee = ko.computed(function() {
            return this.calculateFee(this.otherOpenSpaceGFAShortfall());
        }, this);

        this.calculatedFee = ko.computed(function() {
            if (!this.triggered()) {
                return 0;
            }

            return (
                this.retailFee() +
                this.manufacturingFee() +
                this.officeFee() +
                this.otherFee()
            );
        }, this);
    };

    EasternNeighborhoodsNonResidentialOpenSpaceFee.settings = settings;

    return EasternNeighborhoodsNonResidentialOpenSpaceFee;
});
