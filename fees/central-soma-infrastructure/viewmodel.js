define([
    'knockout',
    'fees/abstract-fee',
    'json!./settings.json',
    './component'
], function(ko, AbstractFee, settings) {

    var CentralSoMaInfrastructureFee = function(params) {
        this.settings = settings;

        AbstractFee.apply(this, [params]);

        this.triggered = ko.computed(function() {

            this.areas = this.isProjectInArea();
            return this.isProjectInArea() &&
                (
                    this.resGFA() >= this.minResGFA ||
                    this.newNonRes() >= this.minNewNonRes ||
                    this.nonResGFA() >= this.minNonResGFA ||
                    parseFloat(this.nonResGFA()) + parseFloat(this.resGFA()) >= this.minAllDev
                );
        }, this);


        this.ready = ko.computed(function() {
            if (!this.triggered()) {
                return true;
            }
            if (this.resGFA() !== null && this.resGFA() !== '' &&
                this.nonResGFA() !== null && this.nonResGFA() !== '' &&
                this.nonResToRes() !== null && this.nonResToRes() !== '' &&
                this.resToNonRes() !== null && this.resToNonRes() !== '' &&
                this.pdrToRes() !== null && this.pdrToRes() !== '' &&
                this.pdrToNonRes() !== null && this.pdrToNonRes() !== '' &&
                ( (this.thereIsResidential() && this.ownershipType() !==null) || (this.thereIsResidential()==false) ) ){
                return true;
                }
            else {
                return false;
            }
        }, this);

        this.thereIsResidential = ko.computed(function() {
            var thereIsResidential = false;
            if (this.resGFA() > 0 || this.nonResToRes() > 0 ||this.pdrToRes() > 0 ) {
                thereIsResidential = true
            }
            return thereIsResidential;
        }, this);

        this.tier = ko.computed(function() {
            var areas = this.isProjectInArea();
            //console.log("areas.length: " +areas.length)
            //console.log("areas[0]: " +areas[0])
            //console.log("areas[1]: " +areas[1])
            if (areas) {
                var tiers = areas.map(function(area) {
                    return area.areaName.split(' - ')[1];
                });
                if (tiers.length > 1) {
                    return null;
                }
                var tier = tiers[0];
                return tier;
            }
        }, this);

        this.applicableNewResFee = ko.computed(function() {
            if (this.tier()=="Tier B") {
                if (this.ownershipType()=="rental") {
                    return this.feePerNewResOrPDRToResRental
                }
                if (this.ownershipType()=="ownership") {
                    return this.feePerNewResOrPDRToResCondo
                }
            }
            return 0;
        }, this);

        this.applicablePDRToNonResFee = ko.computed(function() {
            if (this.tier()=="Tier A") {
                if (this.seekingOfficeAllocation()) {
                    return this.feePerPDRToNonResTierAOfficeAllocation
                }
                if (!this.seekingOfficeAllocation()) {
                    return this.feePerPDRToNonResTierANotOfficeAllocation
                }
            }
            if (this.tier()=="Tier C") {
                if (this.seekingOfficeAllocation()) {
                    return 0
                } else {
                    return this.feePerPDRToNonResTierC
                }


            }
            return 0;
        }, this);

        this.applicableResToNonResFee = ko.computed(function() {
            if (this.tier()=="Tier A") {
                if (this.seekingOfficeAllocation()) {
                    return this.feePerResToNonResTierAOfficeAllocation
                }
                if (!this.seekingOfficeAllocation()) {
                    return this.feePerResToNonResTierANotOfficeAllocation
                }
            }
            if (this.tier()=="Tier C") {
                if (this.seekingOfficeAllocation()) {
                    return 0
                } else {
                    return this.feePerNewNonResTierC
                }


            }
            return 0;
        }, this);

        this.applicableNetNonResFee = ko.computed(function() {
            if (this.tier()=="Tier A") {
                if (this.seekingOfficeAllocation()) {
                    return this.feePerNewNonResTierAOfficeAllocation
                }
                if (!this.seekingOfficeAllocation()) {
                    return this.feePerNewNonResTierANotOfficeAllocation
                }
            }
            if (this.tier()=="Tier C") {
                if (this.seekingOfficeAllocation()) {
                    return 0
                } else {
                    return this.feePerNewNonResTierC
                }


            }
            return 0;
        }, this);

        this.resNewPortion = ko.computed(function() {
            var newPortion = parseFloat(this.resGFA()) - (
                parseFloat(this.nonResToRes()) +
                parseFloat(this.pdrToRes())
            );
            return newPortion > 0 ? newPortion : 0;
        }, this);

        this.nonResNewPortion = ko.computed(function() {
            var newPortion = parseFloat(this.nonResGFA()) - (
                parseFloat(this.pdrToNonRes()) + 
                parseFloat(this.resToNonRes())
            );
            return newPortion > 0 ? newPortion : 0;
        }, this);

        this.calculatedFee = ko.computed(function() {

            var newRes = parseFloat(this.resNewPortion()) || 0;
            var newNonRes = parseFloat(this.nonResNewPortion()) || 0;
            var nonResToRes = parseFloat(this.nonResToRes()) || 0;
            var resToNonRes = parseFloat(this.resToNonRes()) || 0;
            var pdrToRes = parseFloat(this.pdrToRes()) || 0;
            var pdrToNonRes = parseFloat(this.pdrToNonRes()) || 0;
            var housingFee = 0;
            var nonResFee = 0;
            var housingFeeGFA=0

            if (!this.triggered()) {
                return 0;
            }
            console.log(this.tier())
            if (!this.tier()) {
                return null;
            }
            if (this.tier()=="Tier B") {
                if (this.ownershipType()=="rental") {
                    housingFee= (newRes + pdrToRes) * this.feePerNewResOrPDRToResRental
                    this.housingFeeRate=this.feePerNewResOrPDRToResRental
                }
                if (this.ownershipType()=="ownership") {
                    housingFee= (newRes + pdrToRes) * this.feePerNewResOrPDRToResCondo
                    this.housingFeeRate=this.feePerNewResOrPDRToResCondo
                }
            }

            if (this.tier()=="Tier A") {
                if (this.seekingOfficeAllocation()) {
                    nonResFee = (newNonRes * this.feePerNewNonResTierAOfficeAllocation) +
                    (pdrToNonRes * this.feePerPDRToNonResTierAOfficeAllocation)
                } else {
                    nonResFee = (newNonRes * this.feePerNewNonResTierANotOfficeAllocation) +
                    (pdrToNonRes * this.feePerPDRToNonResTierANotOfficeAllocation) +
                    (resToNonRes * this.feePerResToNonResTierANotOfficeAllocation)
                }

            }
            if (this.tier()=="Tier C") {
                if (!this.seekingOfficeAllocation()) {
                    nonResFee = (newNonRes * this.feePerNewNonResTierC) +
                    (pdrToNonRes * this.feePerPDRToNonResTierC)
                }
            }

            console.log("housingFee: "+ housingFee + "nonResFee: "+nonResFee)



            return (housingFee + nonResFee);
        }, this);
    };

    CentralSoMaInfrastructureFee.settings = settings;

    return CentralSoMaInfrastructureFee;
});
