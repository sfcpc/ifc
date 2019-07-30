define([
    'knockout',
    'underscore',
    'fees/abstract-fee',
    'json!./settings.json',
    './component'
], function(ko, _, AbstractFee, settings) {
    var NorthOfMarketFee = function(params) {
        this.settings = settings;
        AbstractFee.apply(this, [params]);
        this.triggered = ko.computed(function() {
            return this.isProjectInArea() && (this.app.finalBuildingHeight() > this.minHeightForTrigger);
        }, this);

        this.ready = ko.computed(function() {
        
            var resGFAAbove80 = this.resGFAAbove80();
            return resGFAAbove80 !== null;
        }, this);

        this.calculatedFee = ko.computed(function() {
            if (!this.triggered()) {
                return 0;
            }
            return this.resGFAAbove80() * this.costPerSquareFoot;
        }, this); 
    };

    NorthOfMarketFee.settings = settings;
    return NorthOfMarketFee;
});
