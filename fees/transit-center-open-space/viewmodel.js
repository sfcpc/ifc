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
                    this.resGSF() >= this.minResGSF ||
                    this.newNonRes() > this.minNewNonRes ||
                    this.nonResGSF() >= this.minNonResGSF
                );
        }, this);

        this.ready = ko.computed(function() {
            if (!this.triggered()) {
                return true;
            }
            return this.retailGSF() !== null && this.retailGSF() !== '' &&
                this.hotelGSF() !== null && this.hotelGSF() !== '' &&
                this.institutionalGSF() !== null && this.institutionalGSF() !== '' &&
                this.industrialGSF() !== null && this.industrialGSF() !== '' &&
                this.parcelArea() !== null && this.parcelArea() !== '';
        }, this);

        this.getFAR = function(gsf) {
            return gsf / self.parcelArea();
        };

        this.getGSFAboveFAR = function(gsf) {
            if (self.getFAR(gsf) <= self.farBaseMax) {
                return 0;
            }
            return gsf - (self.parcelArea() * self.farBaseMax);
        };

        this.calculatedFee = ko.computed(function() {
            if (!this.triggered()) {
                return 0;
            }
            return this.resGSF() * this.resBaseFee +
                this.hotelGSF() * this.hotelBaseFee +
                this.industrialGSF() * this.industrialBaseFee +
                this.officeGSF() * this.officeBaseFee +
                this.getGSFAboveFAR(this.officeGSF()) * this.officeFARFee +
                this.retailGSF() * this.retailBaseFee +
                this.getGSFAboveFAR(this.retailGSF()) * this.retailFARFee +
                this.institutionalGSF() * this.institutionalBaseFee +
                this.getGSFAboveFAR(this.institutionalGSF()) * this.institutionalFARFee;
        }, this);
    };

    TransitCenterOpenSpaceFee.settings = settings;

    return TransitCenterOpenSpaceFee;
});
