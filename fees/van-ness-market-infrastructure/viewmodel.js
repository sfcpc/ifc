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

        this.ready = ko.computed(function() {
            return true;
        }, this);

        this.totalFAR = ko.computed(function() {
            return this.totalGSF() / this.parcelArea();
        }, this);

        this.gsfAbove9To1 = ko.computed(function () {
            var totalFAR = this.totalFAR();
            var totalGSF = this.totalGSF();
            var parcelArea = this.parcelArea();
            return totalFAR > 9 ? totalGSF - (parcelArea * 9) : 0;
        }, this);

        this.gsfAbove9To1Fee = ko.computed(function () {
            var gsfAbove9To1 = this.gsfAbove9To1();
            return gsfAbove9To1 * this.far9to1;
        }, this);

        this.gsfAbove6To1 = ko.computed(function () {
            var totalFAR = this.totalFAR();
            var totalGSF = this.totalGSF();
            var parcelArea = this.parcelArea();
            var gsfAbove9To1 = this.gsfAbove9To1();
            var val = totalFAR > 6 ? totalGSF - gsfAbove9To1 - (parcelArea * 6) : 0;
            return val
        }, this);

        this.gsfAbove6To1Fee = ko.computed(function () {
            var gsfAbove6To1 = this.gsfAbove6To1();
            return gsfAbove6To1 * this.far6to1;
        }, this);

        this.calculatedFee = ko.computed(function() {
            var totalFAR = this.totalFAR();
            if (!this.triggered() || !totalFAR) {
                return 0;
            }
            var totalGSF = this.totalGSF();
            var parcelArea = this.parcelArea();
            var gsfAbove9To1Fee = this.gsfAbove9To1Fee();
            var gsfAbove6To1Fee = this.gsfAbove6To1Fee();
            return gsfAbove9To1Fee + gsfAbove6To1Fee;
        }, this);
    };

    VanNessMarketInfrastructureFee.settings = settings;

    return VanNessMarketInfrastructureFee;
});
