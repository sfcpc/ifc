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

        this.isArticle25 = ko.computed(function() {
            return this.article25;
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
            return "Inclusionary Affordable Housing";
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
                        //after 2016
                        if (this.EEADate() =='EEARadioAfter16') {
                            if (areaNames.indexOf('Tier A') >= 0) {
                                if (this.netNewUnits() < 25) {
                                    if (this.ownershipType() === 'rental') {
                                        return this.umuTierARentalSmall
                                    } else {
                                        return this.umuTierAOwnerSmall
                                    }
                                } else {
                                    if (this.ownershipType() === 'rental') {
                                        return this.umuTierARentalLarge
                                    } else {
                                        return this.umuTierAOwnerLarge
                                    }
                                }
                            } else if (areaNames.indexOf('Tier B') >= 0) {
                                if (this.netNewUnits() < 25) {
                                    if (this.ownershipType() === 'rental') {
                                        return this.umuTierBRentalSmall
                                    } else {
                                        return this.umuTierBOwnerSmall
                                    }
                                } else {
                                    if (this.ownershipType() === 'rental') {
                                        return this.umuTierBRentalLarge
                                    } else {
                                        return this.umuTierBOwnerLarge
                                    }
                                }
                            } else if (areaNames.indexOf('Tier C') >= 0) {
                                if (this.netNewUnits() < 25) {
                                    if (this.ownershipType() === 'rental') {
                                        return this.umuTierCRentalSmall
                                    } else {
                                        return this.umuTierCOwnerSmall
                                    }
                                } else {
                                    if (this.ownershipType() === 'rental') {
                                        return this.umuTierCRentalLarge
                                    } else {
                                        return this.umuTierCOwnerLarge
                                    }
                                }
                            }
                        }
                        //Before 16
                        if (this.EEADate() =='EEARadio16') {
                            if (areaNames.indexOf('Tier A') >= 0) {
                                if (this.netNewUnits() < 25) {
                                    return this.umuTierASmallPercent16
                                } else {
                                    return this.umuTierALargePercent16
                                }
                            }
                            if (areaNames.indexOf('Tier B') >= 0) {
                                if (this.netNewUnits() < 25) {
                                    return this.umuTierBSmallPercent16
                                } else {
                                    return this.umuTierBLargePercent16
                                }
                            }
                            if (areaNames.indexOf('Tier C') >= 0) {
                                if (this.netNewUnits() < 25) {
                                    return this.umuTierCSmallPercent16
                                } else {
                                    return this.umuTierCLargePercent16
                                }
                            }
                        }
                        //Before 15
                        if (this.EEADate() =='EEARadio15') {
                            if (areaNames.indexOf('Tier A') >= 0) {
                                if (this.netNewUnits() < 25) {
                                    return this.umuTierASmallPercent15
                                } else {
                                    return this.umuTierALargePercent15
                                }
                            }
                            if (areaNames.indexOf('Tier B') >= 0) {
                                if (this.netNewUnits() < 25) {
                                    return this.umuTierBSmallPercent15
                                } else {
                                    return this.umuTierBLargePercent15
                                }
                            }
                            if (areaNames.indexOf('Tier C') >= 0) {
                                if (this.netNewUnits() < 25) {
                                    return this.umuTierCSmallPercent15
                                } else {
                                    return this.umuTierCLargePercent15
                                }
                            }
                        }
                        //Before 14
                        if (this.EEADate() =='EEARadio14') {
                            if (areaNames.indexOf('Tier A') >= 0) {
                                if (this.netNewUnits() < 25) {
                                    return this.umuTierASmallPercent14
                                } else {
                                    return this.umuTierALargePercent14
                                }
                            }
                            if (areaNames.indexOf('Tier B') >= 0) {
                                if (this.netNewUnits() < 25) {
                                    return this.umuTierBSmallPercent14
                                } else {
                                    return this.umuTierBLargePercent14
                                }
                            }
                            if (areaNames.indexOf('Tier C') >= 0) {
                                if (this.netNewUnits() < 25) {
                                    return this.umuTierCSmallPercent14
                                } else {
                                    return this.umuTierCLargePercent14
                                }
                            }
                        }
                        //Before 13
                        if (this.EEADate() =='EEARadio13') {
                            if (areaNames.indexOf('Tier A') >= 0) {
                                if (this.netNewUnits() < 25) {
                                    return this.umuTierASmallPercent13
                                } else {
                                    return this.umuTierALargePercent13
                                }
                            }
                            if (areaNames.indexOf('Tier B') >= 0) {
                                if (this.netNewUnits() < 25) {
                                    return this.umuTierBSmallPercent13
                                } else {
                                    return this.umuTierBLargePercent13
                                }
                            }
                            if (areaNames.indexOf('Tier C') >= 0) {
                                if (this.netNewUnits() < 25) {
                                    return this.umuTierCSmallPercent13
                                } else {
                                    return this.umuTierCLargePercent13
                                }
                            }
                        }
                    }
                }
                //console.log(this.finalBuildingHeight())
                if (this.EEADate() =='EEARadioAfter16') {
                    if (this.netNewUnits() < 25) {
                        return this.smallPercentage;
                    } else if (this.ownershipType() === 'rental') {
                        return this.largeRentalPercentage;
                    }
                    return this.largeOwnershipPercentage;
                }
                if (this.EEADate() =='EEARadio16') {
                    if (this.netNewUnits() < 25) {
                        return this.smallPercentage;
                    }
                    if (this.netNewUnits() >= 25) {
                        if (this.finalBuildingHeight()>120) {
                            return this.largePercentageOver120Ft16;
                        } else {
                            return this.largePercentageUnder120Ft16;
                        }
                    }
                }
                if (this.EEADate() =='EEARadio15') {
                    if (this.netNewUnits() < 25) {
                        return this.smallPercentage;
                    }
                    if (this.netNewUnits() >= 25) {
                        if (this.finalBuildingHeight()>120) {
                            return this.largePercentageOver120Ft15;
                        } else {
                            return this.largePercentageUnder120Ft15;
                        }
                    }
                }
                if (this.EEADate() =='EEARadio14') {
                    if (this.netNewUnits() < 25) {
                        return this.smallPercentage;
                    }
                    if (this.netNewUnits() >= 25) {
                        if (this.finalBuildingHeight()>120) {
                            return this.largePercentageOver120Ft14;
                        } else {
                            return this.largePercentageUnder120Ft14;
                        }
                    }
                }
                if (this.EEADate() =='EEARadio13') {
                    if (this.netNewUnits() < 25) {
                        return this.smallPercentage;
                    }
                    if (this.netNewUnits() >= 25) {
                        if (this.finalBuildingHeight()>120) {
                            return this.largePercentageOver120Ft13;
                        } else {
                            return this.largePercentageUnder120Ft13;
                        }
                    }
                }

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
                return parseFloat(this.easternAffordableFee());
            }
            return this.applicableGFA() * this.affordableHousingFee;
        }, this);
    };

    AffordableHousingFee.settings = settings;

    return AffordableHousingFee;
});
