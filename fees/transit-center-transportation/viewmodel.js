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

        this.calculatedFee = ko.computed(function() {
            if (!this.triggered()) {
                return 0;
            }
            return this.resGFA() * this.resBaseFee +
                this.resGFA() * this.resMitigationFee +
                this.getGFAAboveFAR(this.resGFA(), 9) * this.resFARFee +
                this.getGFAAboveFAR(this.resGFA(), 18) * this.resFARFee2 +
                this.hotelGFA() * this.hotelBaseFee +
                this.hotelGFA() * this.hotelMitigationFee +
                this.getGFAAboveFAR(this.hotelGFA(), 9) * this.hotelFARFee +
                this.getGFAAboveFAR(this.hotelGFA(), 18) * this.hotelFARFee2 +
                this.officeGFA() * this.officeBaseFee +
                this.officeGFA() * this.officeMitigationFee +
                this.getGFAAboveFAR(this.officeGFA(), 9) * this.officeFARFee +
                this.getGFAAboveFAR(this.officeGFA(), 18) * this.officeFARFee2 +
                this.retailGFA() * this.retailBaseFee +
                this.retailGFA() * this.retailMitigationFee +
                this.getGFAAboveFAR(this.retailGFA(), 9) * this.retailFARFee +
                this.getGFAAboveFAR(this.retailGFA(), 18) * this.retailFARFee2 +
                this.institutionalGFA() * this.institutionalBaseFee +
                this.institutionalGFA() * this.institutionalMitigationFee +
                this.getGFAAboveFAR(this.institutionalGFA(), 9) * this.institutionalFARFee +
                this.getGFAAboveFAR(this.institutionalGFA(), 18) * this.institutionalFARFee2 +
                this.industrialGFA() * this.industrialBaseFee ;
        }, this);
    };

    TransitCenterTransportationFee.settings = settings;

    return TransitCenterTransportationFee;
});
