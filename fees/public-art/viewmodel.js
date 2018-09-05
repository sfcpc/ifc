define([
    'knockout',
    'underscore',
    'fees/abstract-fee',
    'json!./settings.json',
    './component'
], function(ko, _, AbstractFee, settings) {
    var PublicArtFee = function(params) {
        var self = this;
        this.settings = settings;

        AbstractFee.apply(this, [params]);


        this.triggered = ko.computed(function() {
            return this.isProjectInArea() &&
                (
                    this.firstConstructionDocument() === true
                );
        }, this);

        this.ready = ko.computed(function() {
            if (!this.triggered()) {
                return true;
            }

            if (this.nonResProject()) {
                return this.constructionCost() !== null && this.constructionCost() !== '' && this.posRequirement() !== null && this.posRequirement() !== '';
            }
            else {
                return this.constructionCost() !== null && this.constructionCost() !== ''
            };
        }, this);


        this.calculatedFee = ko.computed(function() {
            if (!this.triggered()) {
                return 0;
            }
                this.publicArtFee = ko.computed(function() {
                    var fee = this.constructionCost() * 0.01

                    if (this.nonResProject() && this.posRequirement() > 1499 && this.posRequirement() < 3000 && fee > this.maxNonResArtFeePOS1499) {
                        fee = this.maxNonResArtFeePOS1499
                    }
                    else if (this.nonResProject() && this.posRequirement() >= 3000 && fee > this.maxNonResArtFeePOS3000) {
                        fee = this.maxNonResArtFeePOS3000
                    }

                    return fee
                }, this)


                return this.publicArtFee()
        }, this);
    };

    PublicArtFee.settings = settings;

    return PublicArtFee;
});
