define([
    'knockout',
    'fees/abstract-fee',
    'json!./settings.json',
    './component'
], function(ko, AbstractFee, settings) {
    var AffordableHousingFee = function(params) {
        this.settings = settings;

        AbstractFee.apply(this, [params]);

        this.areaNames = ko.computed(function() {
            var areas = this.isProjectInArea();
            if (areas) {
                return areas.map(function(area) {
                    return area.areaName;
                }).join(', ');
            }
            return '';
        }, this);

        this.easternElligible = ko.computed(function() {
            var easternElligible = false;
            var areaNames = this.areaNames();
            if (areaNames) {
                if (areaNames.indexOf('Eastern Neighborhoods') >= 0 &&
                    areaNames.indexOf('UMU District') < 0 && (
                    (this.netNewUnits() >= 10 && this.netNewUnits() <= 20)
                    || parseFloat(this.resGFA()) <= 250000)) {
                    easternElligible = true;
                }
            }
            return easternElligible;
        }, this);

        this.feeApplied = ko.computed(function() {
            var areaNames = this.areaNames();
            if (areaNames) {
                if (areaNames.indexOf('UMU District') >= 0) {
                    var feeName = 'UMU District Affordable Housing Fee';
                    if (areaNames.indexOf('Tier A') >= 0) {
                        feeName += ' - Tier A';
                    } else if (areaNames.indexOf('Tier B') >= 0) {
                        feeName += ' - Tier B';
                    } else if (areaNames.indexOf('Tier C') >= 0) {
                        feeName += ' - Tier C';
                    }
                    return feeName;
                }
                if (this.easternElligible() && this.payEasternFee()) {
                    return 'Eastern Neighborhoods Alternate Affordable Housing Fee';
                }
            }
            return this.label;
        }, this);

        this.triggered = ko.computed(function() {
            return this.netNewUnits() >= this.minNewUnits;
        }, this);

        this.ready = ko.computed(function() {
            if (!this.triggered() || this.exemptFromAffordableHousingFee()) {
                return true;
            }
            if (this.feeApplied() === 'Eastern Neighborhoods Alternate Affordable Housing Fee') {
                return this.easternAffordableFee() !== null && this.easternAffordableFee() !== '';
            }
            return this.ownershipType() !== null && this.ownershipType() !== '';
        }, this);

        this.applicableGFAPercentage = ko.computed(function() {
            var areaNames = this.areaNames();
            if (areaNames) {
                if (areaNames.indexOf('UMU District') >= 0) {
                    if (areaNames.indexOf('Tier A') >= 0) {
                        return this.umuTierAPercent;
                    } else if (areaNames.indexOf('Tier B') >= 0) {
                        return this.umuTierBPercent;
                    } else if (areaNames.indexOf('Tier C') >= 0) {
                        return this.umuTierCPercent;
                    }
                }
            }
            if (this.netNewUnits() < 25) {
                return this.smallPercentage;
            } else if (this.ownershipType() === 'rental') {
                return this.largeRentalPercentage;
            }
            return this.largeOwnershipPercentage;
        }, this);

        this.applicableGFA = ko.computed(function() {
            return (
                this.applicableGFAPercentage() / 100
            ) * this.resGFA();
        }, this);

        this.calculatedFee = ko.computed(function() {
            if (this.exemptFromAffordableHousingFee()) {
                return 0;
            }
            if (this.feeApplied() === 'Eastern Neighborhoods Alternate Affordable Housing Fee') {
                return this.easternAffordableFee();
            }
            return this.applicableGFA() * this.affordableHousingFee;
        }, this);
    };

    AffordableHousingFee.settings = settings;

    return AffordableHousingFee;
});
