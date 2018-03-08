define([
    'knockout',
    'underscore',
    'fees/abstract-fee',
    'json!./settings.json',
    './component'
], function(ko, _, AbstractFee, settings) {
    var TransitCenterOpenSpaceFee = function(params) {
        var self = this;
        this.settings = settings;

        AbstractFee.apply(this, [params]);

        this.triggered = ko.computed(function() {
            return this.isProjectInArea() &&
                (
                    this.netNewUnits() >= this.minNetNewUnits ||
                    this.resGFA() >= this.minResGFA ||
                    this.newNonRes() > this.minNewNonRes ||
                    this.nonResGFA() >= this.minNonResGFA
                );
        }, this);

        this.ready = ko.computed(function() {
            if (!this.triggered()) {
                return true;
            }
            return this.retailGFA() !== null && this.retailGFA() !== '' &&
                this.hotelGFA() !== null && this.hotelGFA() !== '' &&
                this.institutionalGFA() !== null && this.institutionalGFA() !== '' &&
                this.industrialGFA() !== null && this.industrialGFA() !== '' &&
                this.parcelArea() !== null && this.parcelArea() !== '';
        }, this);

        this.getFAR = function(gsf) {
            return gsf / self.parcelArea();
        };

        this.getGFAAboveFAR = function(gsf) {
            if (self.getFAR(gsf) <= self.farBaseMax) {
                return 0;
            }
            return gsf - (self.parcelArea() * self.farBaseMax);
        };

        this.totalGFA = ko.computed(function() {
            return parseFloat(this.resGFA()) +
                parseFloat(this.hotelGFA()) +
                parseFloat(this.industrialGFA()) +
                parseFloat(this.officeGFA()) +
                parseFloat(this.retailGFA()) +
                parseFloat(this.institutionalGFA());
        }, this);

        this.percentAboveFAR = ko.computed(function() {
            return this.getGFAAboveFAR(this.totalGFA()) / this.totalGFA();
        }, this);

        this.calculatedFee = ko.computed(function() {
            if (!this.triggered()) {
                return 0;
            }
            var baseFee =  this.resGFA() * this.resBaseFee +
                this.hotelGFA() * this.hotelBaseFee +
                this.industrialGFA() * this.industrialBaseFee +
                this.officeGFA() * this.officeBaseFee +
                this.retailGFA() * this.retailBaseFee +
                this.institutionalGFA() * this.institutionalBaseFee;
            var percentAboveFAR = this.percentAboveFAR();
            var farFee = (percentAboveFAR * this.officeGFA()) * this.officeFARFee  +
                (percentAboveFAR * this.retailGFA()) * this.retailFARFee  +
                (percentAboveFAR * this.institutionalGFA()) * this.institutionalFARFee;
            return baseFee + farFee;
        }, this);
    };

    TransitCenterOpenSpaceFee.settings = settings;

    return TransitCenterOpenSpaceFee;
});
