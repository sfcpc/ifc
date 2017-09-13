define([
	'knockout',
	'fees/abstract-fee',
	'json!./settings.json',
	'./component'
], function(ko, AbstractFee, settings) {
	var VisitacionInfrastructureFee = function(params) {
        this.settings = settings;

		AbstractFee.apply(this, [params]);

		this.triggered = ko.computed(function() {
			return this.isProjectInArea() &&
				(
					(
						this.netNewUnits() >= this.minNetNewUnits ||
						this.resGSF() >= this.minResGSF
					) &&
					this.newUnits() + this.removedUnits() >= this.minResidentialUnits
				);
		}, this);

		this.ready = ko.computed(function() {
			if (!this.triggered()) {
				return true;
			}
			return this.newRes() !== null && this.newRes() !== '' &&
				this.nonResToRes() !== null && this.nonResToRes() !== '' &&
				this.pdrToRes() !== null && this.pdrToRes() !== ''
		}, this);

		this.calculatedFee = ko.computed(function() {
			var newRes = this.newRes() || 0;
			var nonResToRes = this.nonResToRes() || 0;
			var pdrToRes = this.pdrToRes() || 0;
			if (!this.triggered()) {
				return 0;
			}
			return (this.feePerNewRes * newRes) +
				(this.feePerNonResToRes * nonResToRes) +
				(this.feePerPDRToRes * pdrToRes)
		}, this);
	};

	VisitacionInfrastructureFee.settings = settings;

	return VisitacionInfrastructureFee;
});
