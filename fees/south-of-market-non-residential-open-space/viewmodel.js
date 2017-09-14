define([
    'knockout',
    'fees/abstract-fee',
    'json!./settings.json',
    './component'
], function(ko, AbstractFee, settings) {
    var somaNonResOpenSpace = function(params) {
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
            return this.newRetail() !== null && this.newRetail() !== '' &&
                this.newManufacturing() !== null && this.newManufacturing() !== '' &&
                this.newOffice() !== null && this.newOffice() !== '';
        }, this);

        this.calculatedFee = ko.computed(function() {
			var newRetail = this.newRetail() || 0;
			var newManufacturing = this.newManufacturing() || 0;
			var newOffice = this.newOffice() || 0;
			if (!this.triggered()) {
				return 0;
			}
			return ((newRetail / this.openSpaceReqPerRetail) +
				(newManufacturing / this.openSpaceReqPerManufacturing) +
				(newOffice / this.openSpaceReqPerOffice))
                * this.costMultiplier;
		}, this);
    };

    somaNonResOpenSpace.settings = settings;

    return somaNonResOpenSpace;
});
