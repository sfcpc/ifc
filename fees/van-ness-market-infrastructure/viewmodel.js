define([
    'knockout',
    'underscore',
    'fees/abstract-fee',
    'json!./settings.json',
    './component'
], function(ko, _, AbstractFee, settings) {
    var VanNessMarketInfrastructureFee = function(params) {
        this.settings = settings;

        AbstractFee.apply(this, [params]);

        this.triggered = this.isProjectInArea;

        this.netNewGFA = ko.computed(function() {
            var total = parseFloat(this.nonResGFA()) +
                parseFloat(this.pdrGFA()) +
                parseFloat(this.resGFA()) +
                parseFloat(this.officeGFA());
            return total;
        }, this);

        this.ready = ko.computed(function() {
            if (!this.triggered()) {
                return true;
            }
            return this.totalGFA() !== null && this.totalGFA() !== '' &&
                this.parcelArea() !== null && this.parcelArea() !== '';
        }, this);

        this.totalFAR = ko.computed(function() {
            return this.totalGFA() / this.parcelArea();
        }, this);

        this.gsfAbove9To1 = ko.computed(function () {
            var totalFAR = this.totalFAR();
            var totalGFA = this.totalGFA();
            var parcelArea = this.parcelArea();
            return totalFAR > 9 ? totalGFA - (parcelArea * 9) : 0;
        }, this);

        this.gsfAbove6To1 = ko.computed(function () {
            var totalFAR = this.totalFAR();
            var totalGFA = this.totalGFA();
            var parcelArea = this.parcelArea();
            var gsfAbove9To1 = this.gsfAbove9To1();
            return totalFAR > 6 ? totalGFA - gsfAbove9To1 - (parcelArea * 6) : 0;
        }, this);

        this.newGFAAbove6To1 = ko.computed(function () {
            var gsfAbove6To1 = this.gsfAbove6To1();
            var netNewGFA = this.netNewGFA();
            return gsfAbove6To1 > netNewGFA ? netNewGFA : gsfAbove6To1;
        }, this);

        this.gsfAbove6To1Fee = ko.computed(function () {
            var newGFAAbove6To1 = this.newGFAAbove6To1();
            return newGFAAbove6To1 * this.far6to1;
        }, this);

        this.newGFAAbove9To1 = ko.computed(function () {
            var gsfAbove9To1 = this.gsfAbove9To1();
            var remainingNewGFA = this.netNewGFA() - this.newGFAAbove6To1();
            return gsfAbove9To1 > remainingNewGFA ? remainingNewGFA : gsfAbove9To1;
        }, this);

        this.gsfAbove9To1Fee = ko.computed(function () {
            var newGFAAbove9To1 = this.newGFAAbove9To1();
            return newGFAAbove9To1 * this.far9to1;
        }, this);

        this.calculatedFee = ko.computed(function() {
            var totalFAR = this.totalFAR();
            if (!this.triggered() || !totalFAR) {
                return 0;
            }
            var totalGFA = this.totalGFA();
            var parcelArea = this.parcelArea();
            var gsfAbove9To1Fee = this.gsfAbove9To1Fee();
            var gsfAbove6To1Fee = this.gsfAbove6To1Fee();
            return gsfAbove9To1Fee + gsfAbove6To1Fee;
        }, this);
    };

    VanNessMarketInfrastructureFee.settings = settings;

    return VanNessMarketInfrastructureFee;
});
