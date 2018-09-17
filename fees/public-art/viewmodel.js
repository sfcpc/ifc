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
            return this.isProjectInArea() && this.firstConstructionDocument();
        }, this);

        this.ready = ko.computed(function() {
            if (!this.triggered()) {
                return true;
            }

            return this.constructionCost() !== null &&
                this.constructionCost() !== '' &&
                (
                    !this.nonResProject() ||
                    (
                        this.posRequirement() !== null &&
                        this.posRequirement() !== ''
                    )
                );
        }, this);


        this.calculatedFee = ko.computed(function() {
            var fee = 0;
            var maxFee = this.maxNonResArtFeePOS1499;
            if (this.triggered()) {
                fee = this.constructionCost() * 0.01;

                if (this.nonResProject()) {
                    if (this.posRequirement() > 1499) {
                        if (this.posRequirement() >= 3000){
                            maxFee = this.maxNonResArtFeePOS3000;
                        }
                        if (fee > maxFee) {
                            fee = maxFee;
                        }
                    }
                }
            }

            return fee;
        }, this);
    };

    PublicArtFee.settings = settings;

    return PublicArtFee;
});
