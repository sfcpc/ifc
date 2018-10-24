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
            return this.retailGFA() !== null && this.retailGFA() !== '' &&
                this.retailOpenSpaceProvidedGFA() !== null && this.retailOpenSpaceProvidedGFA() !== '' &&
                this.manufacturingGFA() !== null && this.manufacturingGFA() !== '' &&
                this.manufacturingOpenSpaceProvidedGFA() !== null && this.manufacturingOpenSpaceProvidedGFA() !== '' &&
                this.officeGFA() !== null && this.officeGFA() !== '' &&
                this.officeOpenSpaceProvidedGFA() !== null && this.officeOpenSpaceProvidedGFA() !== '' &&
                this.otherGFA() !== null && this.otherGFA() !== '' &&
                this.otherOpenSpaceProvidedGFA() !== null && this.otherOpenSpaceProvidedGFA() !== '';
        }, this);


        this.calculatedFee = ko.computed(function() {
            if (!this.triggered()) {
                return 0;
            }

            this.calculateRequiredOpenSpaceOrFee = function(a, b, c) {
                return (a-b)*eval(c);
            };

            this.retailOpenSpaceRequiredGFA(
                this.calculateRequiredOpenSpaceOrFee(this.retailGFA(), this.retailOpenSpaceProvidedGFA(), this.openSpaceRequirement['retail'])
            );

            this.manufacturingOpenSpaceRequiredGFA(
                this.calculateRequiredOpenSpaceOrFee(this.manufacturingGFA(), this.manufacturingOpenSpaceProvidedGFA(), this.openSpaceRequirement['manufacturing'])
            );

            this.officeOpenSpaceRequiredGFA(
                this.calculateRequiredOpenSpaceOrFee(this.officeGFA(), this.officeOpenSpaceProvidedGFA(), this.openSpaceRequirement['office'])
            );

            this.otherOpenSpaceRequiredGFA(
                this.calculateRequiredOpenSpaceOrFee(this.otherGFA(), this.otherOpenSpaceProvidedGFA(), this.openSpaceRequirement['other'])
            );

            this.retailFee = (this.calculateRequiredOpenSpaceOrFee(this.retailOpenSpaceRequiredGFA(), this.retailOpenSpaceProvidedGFA(), this.feePerOpenSpaceGFA) > 0) ? this.calculateRequiredOpenSpaceOrFee(this.retailOpenSpaceRequiredGFA(), this.retailOpenSpaceProvidedGFA(), this.feePerOpenSpaceGFA) : 0;
            this.manufacturingFee = (this.calculateRequiredOpenSpaceOrFee(this.manufacturingOpenSpaceRequiredGFA(), this.manufacturingOpenSpaceProvidedGFA(), this.feePerOpenSpaceGFA) > 0) ? this.calculateRequiredOpenSpaceOrFee(this.manufacturingOpenSpaceRequiredGFA(), this.manufacturingOpenSpaceProvidedGFA(), this.feePerOpenSpaceGFA) : 0;
            this.officeFee = (this.calculateRequiredOpenSpaceOrFee(this.officeOpenSpaceRequiredGFA(), this.officeOpenSpaceProvidedGFA(), this.feePerOpenSpaceGFA) > 0) ? this.calculateRequiredOpenSpaceOrFee(this.officeOpenSpaceRequiredGFA(), this.officeOpenSpaceProvidedGFA(), this.feePerOpenSpaceGFA) : 0;
            this.otherFee = (this.calculateRequiredOpenSpaceOrFee(this.otherOpenSpaceRequiredGFA(), this.otherOpenSpaceProvidedGFA(), this.feePerOpenSpaceGFA) > 0) ? this.calculateRequiredOpenSpaceOrFee(this.otherOpenSpaceRequiredGFA(), this.otherOpenSpaceProvidedGFA(), this.feePerOpenSpaceGFA) : 0;

            return (this.retailFee + this.manufacturingFee + this.officeFee + this.otherFee);

        }, this);
    };

    EasternNeighborhoodsNonResidentialOpenSpaceFee.settings = settings;

    return EasternNeighborhoodsNonResidentialOpenSpaceFee;
});
