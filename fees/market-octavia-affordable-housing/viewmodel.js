define([
    'knockout',
    'underscore',
    'fees/abstract-fee',
    'json!./settings.json',
    './component'
], function(ko, _, AbstractFee, settings) {
    var MarketOctaviaAffordableHousingFee = function(params) {
        this.settings = settings;

        AbstractFee.apply(this, [params]);

        this.district = ko.computed(function() {
            var features = this.isProjectInArea();
            if (Array.isArray(features) && features.length > 0) {
                var attr = features[0].attributes;
                return attr.districtname || attr.name;
            }
        }, this)

        this.triggered = ko.computed(function() {
            return this.isProjectInArea() &&
                (
                    this.netNewUnits() >= this.minNetNewUnits
                );
        }, this);

        this.ready = ko.computed(function() {
            if (!this.triggered()) {
                return true;
            }
            return this.newRes() !== null && this.newRes() !== '' &&
                this.nonResToRes() !== null && this.nonResToRes() !== '' &&
                this.pdrToRes() !== null && this.pdrToRes() !== '';
        }, this);

        this.calculatedFee = ko.computed(function() {
            var newRes = this.newRes() || 0;
            var nonResToRes = this.nonResToRes() || 0;
            var pdrToRes = this.pdrToRes() || 0;
            var district = this.district();
            if (!this.triggered() || !district) {
                return 0;
            }

            return (this[district].feePerNewRes * newRes) +
                (this[district].feePerNonResToRes * nonResToRes) +
                (this[district].feePerPDRToRes * pdrToRes);
        }, this);
    };

    MarketOctaviaAffordableHousingFee.settings = settings;

    return MarketOctaviaAffordableHousingFee;
});
