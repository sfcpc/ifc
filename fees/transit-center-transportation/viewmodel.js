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

        this.getGSFAboveFAR = function(gsf, far) {
            if (self.getFAR(gsf) <= far) {
                return 0;
            }
            return gsf - (self.parcelArea() * far);
        };

        this.calculatedFee = ko.computed(function() {
            if (!this.triggered()) {
                return 0;
            }
            return this.resGSF() * this.resBaseFee +
                this.resGSF() * this.resMitigationFee +
                this.getGSFAboveFAR(this.resGSF(), 9) * this.resFARFee +
                this.getGSFAboveFAR(this.resGSF(), 18) * this.resFARFee2 +
                this.hotelGSF() * this.hotelBaseFee +
                this.hotelGSF() * this.hotelMitigationFee +
                this.getGSFAboveFAR(this.hotelGSF(), 9) * this.hotelFARFee +
                this.getGSFAboveFAR(this.hotelGSF(), 18) * this.hotelFARFee2 +
                this.officeGSF() * this.officeBaseFee +
                this.officeGSF() * this.officeMitigationFee +
                this.getGSFAboveFAR(this.officeGSF(), 9) * this.officeFARFee +
                this.getGSFAboveFAR(this.officeGSF(), 18) * this.officeFARFee2 +
                this.retailGSF() * this.retailBaseFee +
                this.retailGSF() * this.retailMitigationFee +
                this.getGSFAboveFAR(this.retailGSF(), 9) * this.retailFARFee +
                this.getGSFAboveFAR(this.retailGSF(), 18) * this.retailFARFee2 +
                this.institutionalGSF() * this.institutionalBaseFee +
                this.institutionalGSF() * this.institutionalMitigationFee +
                this.getGSFAboveFAR(this.institutionalGSF(), 9) * this.institutionalFARFee +
                this.getGSFAboveFAR(this.institutionalGSF(), 18) * this.institutionalFARFee2 +
                this.industrialGSF() * this.industrialBaseFee ;
        }, this);
    };

    TransitCenterTransportationFee.settings = settings;

    return TransitCenterTransportationFee;
});
