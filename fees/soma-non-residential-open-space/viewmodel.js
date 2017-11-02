define([
    'knockout',
    'fees/abstract-fee',
    'json!./settings.json',
    'utils/mapserver',
    './component'
], function(ko, AbstractFee, settings, mapserverUtils) {
    var somaNonResOpenSpace = function(params) {
        var self = this;
        this.settings = settings;

        AbstractFee.apply(this, [params]);

        this.triggered = ko.computed(function() {
            return this.isProjectInArea() &&
                (
                    this.newNonRes() >= this.minNewNonResGSF ||
                    this.nonResGSF() >= this.minNetNonResGSF
                );
        }, this);

        this.ready = ko.computed(function() {
            if (!this.triggered()) {
                return true;
            }
            return this.retailGSF() !== null && this.retailGSF() !== '' &&
                this.newManufacturing() !== null && this.newManufacturing() !== '' &&
                this.officeGSF() !== null && this.officeGSF() !== '';
        }, this);

        this.feeIfRequired = ko.computed(function() {
            var retailGSF = this.retailGSF() || 0;
            var newManufacturing = this.newManufacturing() || 0;
            var officeGSF = this.officeGSF() || 0;
            return (
                (retailGSF / this.openSpaceReqPerRetail) +
                (newManufacturing / this.openSpaceReqPerManufacturing) +
                (officeGSF / this.openSpaceReqPerOffice)
            ) * this.costMultiplier;
        }, this);

        this.calculatedFee = ko.computed(function() {
            if (!this.triggered() || !this.paySomaFee()) {
                return 0;
            }
            return this.feeIfRequired();
        }, this);

        this.openSpaceRequired = ko.computed(function() {
            return (this.retailGSF() / this.openSpaceReqPerRetail) +
                (this.newManufacturing() / this.openSpaceReqPerManufacturing) +
                (this.officeGSF() / this.openSpaceReqPerOffice);
        }, this);
    };

    somaNonResOpenSpace.settings = settings;

    return somaNonResOpenSpace;
});
