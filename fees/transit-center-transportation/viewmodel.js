define([
    'knockout',
    'underscore',
    'fees/abstract-fee',
    'json!./settings.json',
    './component'
], function(ko, _, AbstractFee, settings) {
    var TransitCenterTransportationFee = function(params) {
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

        this.getGFAAboveFAR = function(gsf, far) {
            if (self.getFAR(gsf) <= far) {
                return 0;
            }
            return gsf - (self.parcelArea() * far);
        };

        this.totalGFA = ko.computed(function() {
            return parseFloat(this.resGFA()) +
                parseFloat(this.hotelGFA()) +
                parseFloat(this.industrialGFA()) +
                parseFloat(this.officeGFA()) +
                parseFloat(this.retailGFA()) +
                parseFloat(this.institutionalGFA());
        }, this);

        this.percentAboveFAR1 = ko.computed(function() {
            return this.getGFAAboveFAR(this.totalGFA(), 9) / this.totalGFA();
        }, this);

        this.percentAboveFAR2 = ko.computed(function() {
            return this.getGFAAboveFAR(this.totalGFA(), 18) / this.totalGFA();
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
            var mitigationFee = this.resGFA() * this.resMitigationFee +
                this.hotelGFA() * this.hotelMitigationFee +
                this.officeGFA() * this.officeMitigationFee +
                this.retailGFA() * this.retailMitigationFee +
                this.institutionalGFA() * this.institutionalMitigationFee;
            var percentAboveFAR1 = this.percentAboveFAR1();
            var percentAboveFAR2 = this.percentAboveFAR2();
            var farFee1 = (percentAboveFAR1 * this.officeGFA()) * this.officeFARFee  +
                (percentAboveFAR1 * this.retailGFA()) * this.retailFARFee  +
                (percentAboveFAR1 * this.institutionalGFA()) * this.institutionalFARFee;
            var farFee2 = (percentAboveFAR2 * this.officeGFA()) * this.officeFARFee2  +
                (percentAboveFAR2 * this.retailGFA()) * this.retailFARFee2  +
                (percentAboveFAR2 * this.institutionalGFA()) * this.institutionalFARFee2;
            return baseFee + mitigationFee + farFee1 + farFee2;
        }, this);
    };

    TransitCenterTransportationFee.settings = settings;

    return TransitCenterTransportationFee;
});
