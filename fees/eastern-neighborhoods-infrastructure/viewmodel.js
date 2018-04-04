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
                this.nonResToResEN() !== null && this.nonResToResEN() !== '' &&
                this.pdrToResEN() !== null && this.pdrToResEN() !== '' &&
                this.pdrToNonResEN() !== null && this.pdrToNonResEN() !== '' &&
                this.nonResToResReplacement() !== null && this.nonResToResReplacement() !== '' &&
                this.pdrToResReplacement() !== null && this.pdrToResReplacement() !== '' &&
                this.pdrToNonResReplacement() !== null && this.pdrToNonResReplacement() !== '' ;
        }, this);

        this.tier = ko.computed(function() {
            //console.log("here")
            var areas = this.isProjectInArea();
            if (areas) {
                var defaultAreaName = this.areaName[0];
                var prefix = defaultAreaName + ' - ';
                var tiers = areas.map(function(area) {

                    return area.areaName;

                }).reduce(function(tierNames, areaName) {
                    //console.log("here2")
                    if (areaName !== defaultAreaName) {
                        var tierName = areaName.split(prefix)[1];
                        tierNames.push(tierName);
                    }
                    //console.log("tierNames: "+tierNames)
                    return tierNames;
                }, []);
                if (tiers.length > 1 || !(tiers[0] in this.fees)) {
                    return null;
                }
                //console.log("tiers[0]: "+tiers[0]);
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
            var nonResToResEN = this.nonResToResEN() || 0;
            var pdrToResEN = this.pdrToResEN() || 0;
            var pdrToNonResEN = this.pdrToNonResEN() || 0;

            var nonResToResReplacement = this.nonResToResReplacement() || 0;
            var pdrToResReplacement = this.pdrToResReplacement() || 0;
            var pdrToNonResReplacement = this.pdrToNonResReplacement() || 0;

            var allAffordable = this.allAffordable() || 0;

            var tmpTier="";




            if (tier) {
                //console.log(tier);
                //console.log("cccc"+fee.tier())
                //console.log("allAffordable: "+allAffordable);
                //tmpTier=tier;
                if (allAffordable && (tier == "Tier 2" || tier == "Tier 3") ) {
                    tier = tier +  " - Affordable"
                }
                //console.log("tier: " + tier)
                return (this.fees[tier].newRes * newRes) +
                    (this.fees[tier].newNonRes * newNonRes) +
                    (this.fees["Tier 1"].nonResToRes * nonResToResEN) +
                    (this.fees["Tier 1"].pdrToRes * pdrToResEN) +
                    (this.fees["Tier 1"].pdrToNonRes * pdrToNonResEN) +
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
