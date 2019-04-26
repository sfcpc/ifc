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

        // console.log(this.triggered)
        // this.netNewGFA = ko.computed(function() {
        //     var total = parseFloat(this.nonResGFA()) +
        //         parseFloat(this.pdrGFA()) +
        //         parseFloat(this.resGFA()) +
        //         parseFloat(this.officeGFA());
        //     return total;
        // }, this);

        this.ready = ko.computed(function() {
            if (!this.triggered()) {
                return true;
            }
            console.log(this.officeGFA())
            return this.officeGFA() !== null;
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
