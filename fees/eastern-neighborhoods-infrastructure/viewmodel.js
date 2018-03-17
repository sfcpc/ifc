define([
    'knockout',
    'fees/abstract-fee',
    'json!./settings.json',
    './component'
], function(ko, AbstractFee, settings) {
    var EasternNeighborhoodsInfrastructureFee = function(params) {
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
            return this.newRes() !== null && this.newRes() !== '' &&
                this.newNonRes() !== null && this.newNonRes() !== '' &&
                this.nonResToRes() !== null && this.nonResToRes() !== '' &&
                this.pdrToRes() !== null && this.pdrToRes() !== '' &&
                this.pdrToNonRes() !== null && this.pdrToNonRes() !== '';
        }, this);
        
        this.tier = ko.computed(function() {
            var area = this.isProjectInArea();
            if (area) {
                var tiers = area.split('Eastern Neighborhoods Infrastructure Impact Fee - ');
                tiers.shift();
                if (tiers.length > 1 || !(tiers[0] in this.fees)) {
                    return null;
                }
                return tiers[0];
            }
        }, this);

        this.calculatedFee = ko.computed(function() {
            if (!this.triggered()) {
                return 0;    
            }
            var tier = this.tier();
            var newRes = this.newRes() || 0;
            var newNonRes = this.newNonRes() || 0;
            var nonResToRes = this.nonResToRes() || 0;
            var pdrToRes = this.pdrToRes() || 0;
            var pdrToNonRes = this.pdrToNonRes() || 0;
            if (tier) {
                return (this.fees[tier].newRes * newRes) +
                    (this.fees[tier].newNonRes * newNonRes) +
                    (this.fees[tier].nonResToRes * nonResToRes) +
                    (this.fees[tier].pdrToRes * pdrToRes) +
                    (this.fees[tier].pdrToNonRes * pdrToNonRes);
            }
            return null;
        }, this);
    };

    EasternNeighborhoodsInfrastructureFee.settings = settings;

    return EasternNeighborhoodsInfrastructureFee;
});
