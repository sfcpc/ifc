define([
    'knockout',
    'underscore',
    'fees/abstract-fee',
    'json!./settings.json',
    './component'
], function(ko, _, AbstractFee, settings) {
    var UnionSquareParkRecreateAndOpenSpaceFee = function(params) {
        this.settings = settings;

        AbstractFee.apply(this, [params]);

        this.triggered = ko.computed(function() {
            return this.isProjectInArea();
        }, this);

        this.ready = ko.computed(function() {
            if (!this.triggered()) {
                return true;
            }
            return this.officeGFA() !== null;
        }, this);

        this.isArticle25 = ko.computed(function() {
            return this.article25;
        }, this);

        this.calculatedFee = ko.computed(function() {
            if (!this.triggered()) {
                return 0;
            }
            return this.officeGFA() * this.costPerSquareFoot;
        }, this);
    };

    UnionSquareParkRecreateAndOpenSpaceFee.settings = settings;
    return UnionSquareParkRecreateAndOpenSpaceFee;
});
