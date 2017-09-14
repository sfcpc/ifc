define([
    'knockout',
    'fees/abstract-fee',
    'json!./settings.json',
    './component'
], function(ko, AbstractFee, settings) {
    var EasternNeighborhoodsInfrastructureFee = function(params) {
        this.settings = settings;

        AbstractFee.apply(this, [params]);

        this.tier = ko.computed(function() {
            var heightIncrease = this.heightIncrease() || 0;
            var tier = 0
            if (heightIncrease >= this.tier2Height.min && heightIncrease < this.tier2Height.max) {
                tier = 1
            }
            else if (heightIncrease > this.tier3Height.min) {
                tier = 2
            }
            return tier
        }, this)

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
                this.newTIDF() !== null && this.newTIDF() !== '' &&
                this.nonResToRes() !== null && this.nonResToRes() !== '' &&
                this.pdrToRes() !== null && this.pdrToRes() !== '' &&
                this.pdrToNonRes() !== null && this.pdrToNonRes() !== '' &&
                this.heightIncrease() !== null && this.heightIncrease() !== '';
        }, this);

        this.calculatedFee = ko.computed(function() {
            var newRes = this.newRes() || 0;
            var newNonRes = this.newNonRes() || 0;
            var newTIDF = this.newTIDF() || 0;
            var nonResToRes = this.nonResToRes() || 0;
            var pdrToRes = this.pdrToRes() || 0;
            var pdrToNonRes = this.pdrToNonRes() || 0;
            var tier = this.tier();

            if(!this.triggered()) {
                return 0;
            }

            return (this.tiers[tier].feePerNewRes * newRes) +
                (this.tiers[tier].feePerNewNonRes * newNonRes) +
                (this.tiers[tier].feePerNewTIDF * newTIDF) +
                (this.tiers[tier].feePerNonResToRes * nonResToRes) +
                (this.tiers[tier].feePerPDRToRes * pdrToRes) +
                (this.tiers[tier].feePerPDRToNonRes * pdrToNonRes);
        }, this);
    };

    EasternNeighborhoodsInfrastructureFee.settings = settings;

    return EasternNeighborhoodsInfrastructureFee;
});
