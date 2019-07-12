define([
    'knockout',
    'fees/abstract-fee',
    'json!./settings.json',
    './component'
], function(ko, AbstractFee, settings) {
    var RinconHillInfrastructureFee = function(params) {
        this.settings = settings;

        AbstractFee.apply(this, [params]);

        this.triggered = ko.computed(function() {
            return this.isProjectInArea() &&
                (
                    this.netNewUnits() >= this.minNetNewUnits ||
                    this.resGFA() >= this.minResGFA
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

        this.isArticle25 = ko.computed(function() {
            return this.article25;
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

    RinconHillInfrastructureFee.settings = settings;

    return RinconHillInfrastructureFee;
});
