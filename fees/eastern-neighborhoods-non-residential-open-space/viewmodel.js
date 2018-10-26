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


        this.calculateRequiredOpenSpace = function(nonResGFA, requiredOpenSpaceGFAPerFootNonRes) {
            return nonResGFA/requiredOpenSpaceGFAPerFootNonRes > 0 ? requiredOpenSpaceGFAPerFootNonRes : 0;
        };

        this.retailOpenSpaceRequiredGFA = ko.computed(function() {
            return this.calculateRequiredOpenSpace(this.retailGFA(), this.openSpaceRequirementPerFootNonRes['retail']);
        }, this);

        this.manufacturingOpenSpaceRequiredGFA = ko.computed(function() {
            return this.calculateRequiredOpenSpace(this.manufacturingGFA(), this.openSpaceRequirementPerFootNonRes['manufacturing']);
        }, this);

        this.officeOpenSpaceRequiredGFA = ko.computed(function() {
            return this.calculateRequiredOpenSpace(this.officeGFA(), this.openSpaceRequirementPerFootNonRes['office']);
        }, this);

        this.otherOpenSpaceRequiredGFA = ko.computed(function() {
            return this.calculateRequiredOpenSpace(this.otherGFA(), this.openSpaceRequirementPerFootNonRes['other']);
        }, this);


        this.calculateFee = function(requiredOpenSpace, providedOpenSpace, feePerOpenSpaceGFA) {
            return (requiredOpenSpace-providedOpenSpace)*feePerOpenSpaceGFA > 0 ? (requiredOpenSpace-providedOpenSpace)*feePerOpenSpaceGFA : 0;
        };

        this.retailFee = ko.computed(function() {
            return this.calculateFee(this.retailOpenSpaceRequiredGFA(), this.retailOpenSpaceProvidedGFA(), this.feePerOpenSpaceGFA);
        }, this);

        this.manufacturingFee = ko.computed(function() {
            return this.calculateFee(this.manufacturingOpenSpaceRequiredGFA(), this.manufacturingOpenSpaceProvidedGFA(), this.feePerOpenSpaceGFA);
        }, this);

        this.officeFee = ko.computed(function() {
            return this.calculateFee(this.officeOpenSpaceRequiredGFA(), this.officeOpenSpaceProvidedGFA(), this.feePerOpenSpaceGFA);
        }, this);

        this.otherFee = ko.computed(function() {
            return this.calculateFee(this.otherOpenSpaceRequiredGFA(), this.otherOpenSpaceProvidedGFA(), this.feePerOpenSpaceGFA);
        }, this);


        this.calculatedFee = ko.computed(function() {
            if (!this.triggered()) {
                return 0;
            }

            return (this.retailFee() + this.manufacturingFee() + this.officeFee() + this.otherFee());

        }, this);
    };

    EasternNeighborhoodsNonResidentialOpenSpaceFee.settings = settings;

    return EasternNeighborhoodsNonResidentialOpenSpaceFee;
});
