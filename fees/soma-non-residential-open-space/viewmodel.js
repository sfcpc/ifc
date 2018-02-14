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
                    this.newNonRes() >= this.minNewNonResGFA ||
                    this.nonResGFA() >= this.minNetNonResGFA
                );
        }, this);

        this.ready = ko.computed(function() {
            if (!this.triggered()) {
                return true;
            }
            return this.retailGFA() !== null && this.retailGFA() !== '' &&
                this.newManufacturing() !== null && this.newManufacturing() !== '' &&
                this.officeGFA() !== null && this.officeGFA() !== '';
        }, this);

        this.feeIfRequired = ko.computed(function() {
            var retailGFA = this.retailGFA() || 0;
            var newManufacturing = this.newManufacturing() || 0;
            var officeGFA = this.officeGFA() || 0;
            return (
                (retailGFA / this.openSpaceReqPerRetail) +
                (newManufacturing / this.openSpaceReqPerManufacturing) +
                (officeGFA / this.openSpaceReqPerOffice)
            ) * this.costMultiplier;
        }, this);

        this.calculatedFee = ko.computed(function() {
            if (!this.triggered() || !this.paySomaFee()) {
                return 0;
            }
            return this.feeIfRequired();
        }, this);

        this.openSpaceRequired = ko.computed(function() {
            return (this.retailGFA() / this.openSpaceReqPerRetail) +
                (this.newManufacturing() / this.openSpaceReqPerManufacturing) +
                (this.officeGFA() / this.openSpaceReqPerOffice);
        }, this);
    };

    somaNonResOpenSpace.settings = settings;

    return somaNonResOpenSpace;
});
