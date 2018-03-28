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
                this.pdrToNonRes() !== null && this.pdrToNonRes() !== '' &&
                this.nonResToResReplacement() !== null && this.nonResToResReplacement() !== '' &&
                this.pdrToResReplacement() !== null && this.pdrToResReplacement() !== '' &&
                this.pdrToNonResReplacement() !== null && this.pdrToNonResReplacement() !== '';
        }, this);

        this.tier = ko.computed(function() {
            var areas = this.isProjectInArea();
            if (areas) {
                var defaultAreaName = this.areaName[0];
                var prefix = defaultAreaName + ' - ';
                var tiers = areas.map(function(area) {
                    return area.areaName;
                }).reduce(function(tierNames, areaName) {
                    if (areaName !== defaultAreaName) {
                        var tierName = areaName.split(prefix)[1];
                        tierNames.push(tierName);
                    }
                    return tierNames;
                }, []);
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

            var nonResToResReplacement = this.nonResToResReplacement() || 0;
            var pdrToResReplacement = this.pdrToResReplacement() || 0;
            var pdrToNonResReplacement = this.pdrToNonResReplacement() || 0;
            if (tier) {
                //console.log(tier);
                return (this.fees[tier].newRes * newRes) +
                    (this.fees[tier].newNonRes * newNonRes) +
                    (this.fees["Tier 1"].nonResToRes * nonResToRes) +
                    (this.fees["Tier 1"].pdrToRes * pdrToRes) +
                    (this.fees["Tier 1"].pdrToNonRes * pdrToNonRes) +
                    (this.fees[tier].nonResToRes * nonResToResReplacement) +
                    (this.fees[tier].pdrToRes * pdrToResReplacement) +
                    (this.fees[tier].pdrToNonRes * pdrToNonResReplacement);
            }
            return null;
        }, this);
    };

    EasternNeighborhoodsInfrastructureFee.settings = settings;

    return EasternNeighborhoodsInfrastructureFee;
});
