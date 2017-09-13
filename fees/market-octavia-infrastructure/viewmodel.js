define([
	'knockout',
	'fees/abstract-fee',
	'json!./settings.json',
	'./component'
], function(ko, AbstractFee, settings) {
	var MarketOctaviaInfrastructureFee = function(params) {
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
			return this.newRes() !== null && this.newRes() !== '' &&
				this.newNonRes() !== null && this.newNonRes() !== '' &&
				this.nonResToRes() !== null && this.nonResToRes() !== '' &&
				this.pdrToRes() !== null && this.pdrToRes() !== '' &&
				this.pdrToNonRes() !== null && this.pdrToNonRes() !== '';
		}, this);

		this.calculatedFee = ko.computed(function() {
			var newRes = this.newRes() || 0;
			var newNonRes = this.newNonRes() || 0;
			var nonResToRes = this.nonResToRes() || 0;
			var pdrToRes = this.pdrToRes() || 0;
			var pdrToNonRes = this.pdrToNonRes() || 0;
			if (!this.triggered()) {
				return 0;
			}
			return (this.feePerNonResToRes * newRes) +
				(this.feePerNewNonRes * newNonRes) +
				(this.feePerNonResToRes * nonResToRes) +
				(this.feePerPDRToRes * pdrToRes) +
				(this.feePerPDRToNonRes * pdrToNonRes);
		}, this);
	};

	MarketOctaviaInfrastructureFee.name = settings.name;

	return MarketOctaviaInfrastructureFee;
});
