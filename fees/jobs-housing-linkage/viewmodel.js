define([
    'knockout',
    'fees/abstract-fee',
    'json!./settings.json',
    './component'
], function(ko, AbstractFee, settings) {
    var JobsHousingLinkageFee = function(params) {
        this.settings = settings;

        AbstractFee.apply(this, [params]);

        this.triggered = ko.computed(function() {
            return (
                this.nonResGFA() >= this.minNonResGFA
            );
        }, this);

        this.ready = ko.computed(function() {
            if (!this.triggered()) {
                return true;
            }
            return this.newEnt() !== null && this.newEnt() !== '' &&
                this.hotelGFA() !== null && this.hotelGFA() !== '' &&
                this.newIntegratedPDR() !== null && this.newIntegratedPDR() !== '' &&
                this.officeGFA() !== null && this.officeGFA() !== '' &&
                this.newResearchAndDevelopment() !== null && this.newResearchAndDevelopment() !== '' &&
                this.newRetail() !== null && this.newRetail() !== '' &&
                this.newSmallEnterpriseWorkspace() !== null && this.newSmallEnterpriseWorkspace() !== '' &&
                this.oldPDRToEnt() !== null && this.oldPDRToEnt() !== '' &&
                this.oldPDRToHotel() !== null && this.oldPDRToHotel() !== '' &&
                this.oldPDRToIntegratedPDR() !== null && this.oldPDRToIntegratedPDR() !== '' &&
                this.oldPDRToOffice() !== null && this.oldPDRToOffice() !== '' &&
                this.oldPDRToResearchAndDevelopment() !== null && this.oldPDRToResearchAndDevelopment() !== '' &&
                this.oldPDRToRetail() !== null && this.oldPDRToRetail() !== '' &&
                this.oldPDRToSmallEnterpriseWorkspace() !== null && this.oldPDRToSmallEnterpriseWorkspace() !== '' &&
                this.newPDRToEnt() !== null && this.newPDRToEnt() !== '' &&
                this.newPDRToHotel() !== null && this.newPDRToHotel() !== '' &&
                this.newPDRToIntegratedPDR() !== null && this.newPDRToIntegratedPDR() !== '' &&
                this.newPDRToOffice() !== null && this.newPDRToOffice() !== '' &&
                this.newPDRToResearchAndDevelopment() !== null && this.newPDRToResearchAndDevelopment() !== '' &&
                this.newPDRToRetail() !== null && this.newPDRToRetail() !== '' &&
                this.newPDRToSmallEnterpriseWorkspace() !== null && this.newPDRToSmallEnterpriseWorkspace() !== '' &&
                this.resToEnt() !== null && this.resToEnt() !== '' &&
                this.resToHotel() !== null && this.resToHotel() !== '' &&
                this.resToIntegratedPDR() !== null && this.resToIntegratedPDR() !== '' &&
                this.resToOffice() !== null && this.resToOffice() !== '' &&
                this.resToResearchAndDevelopment() !== null && this.resToResearchAndDevelopment() !== '' &&
                this.resToRetail() !== null && this.resToRetail() !== '' &&
                this.resToSmallEnterpriseWorkspace() !== null && this.resToSmallEnterpriseWorkspace() !== '' &&
                this.feeCredit() !== null && this.feeCredit() !== '';
        }, this);

        this.getFeeByType = function(ent, hotel, integratedPDR, office, researchAndDevelopment, retail, smallEnterpriseWorkspace, oldPDR) {
            var feePerNewEntertainment = oldPDR ? this.oldFeePerNewEntertainment : this.feePerNewEntertainment;
            var feePerNewHotel = oldPDR ? this.oldFeePerNewHotel : this.feePerNewHotel;
            var feePerNewIntegratedPDR = oldPDR ? this.oldFeePerNewIntegratedPDR : this.feePerNewIntegratedPDR;
            var feePerNewOffice = oldPDR ? this.oldFeePerNewOffice : this.feePerNewOffice;
            var feePerNewResearchAndDevelopment = oldPDR ? this.oldFeePerNewResearchAndDevelopment : this.feePerNewResearchAndDevelopment;
            var feePerNewRetail = oldPDR ? this.oldFeePerNewRetail : this.feePerNewRetail;
            var feePerNewSmallEnterpriseWorkspace = oldPDR ? this.oldFeePerNewSmallEnterpriseWorkspace : this.feePerNewSmallEnterpriseWorkspace;
            ent = ent() || 0;
            hotel = hotel() || 0;
            integratedPDR = integratedPDR() || 0;
            office = office() || 0;
            researchAndDevelopment = researchAndDevelopment() || 0;
            retail = retail() || 0;
            smallEnterpriseWorkspace = smallEnterpriseWorkspace() || 0;
            return (feePerNewEntertainment * ent) +
                (feePerNewHotel * hotel) +
                (feePerNewIntegratedPDR * integratedPDR) +
                (feePerNewOffice * office) +
                (feePerNewResearchAndDevelopment * researchAndDevelopment) +
                (feePerNewRetail * retail) +
                (feePerNewSmallEnterpriseWorkspace * smallEnterpriseWorkspace);
        };

        var getNewPortion = function(total, changeFromOldPDR, changeFromNewPDR, changeFromRes) {
            var newPortion = parseFloat(total()) - (
                parseFloat(changeFromOldPDR()) +
                parseFloat(changeFromNewPDR()) +
                parseFloat(changeFromRes())
            );
            return newPortion > 0 ? newPortion : 0;
        };

        this.entNewPortion = ko.computed(function() {
            return getNewPortion(
                this.newEnt,
                this.oldPDRToEnt,
                this.newPDRToEnt,
                this.resToEnt
            );
        }, this);

        this.hotelNewPortion = ko.computed(function() {
            return getNewPortion(
                this.hotelGFA,
                this.oldPDRToHotel,
                this.newPDRToHotel,
                this.resToHotel
            );
        }, this);

        this.integratedPDRNewPortion = ko.computed(function() {
            return getNewPortion(
                this.newIntegratedPDR,
                this.oldPDRToIntegratedPDR,
                this.newPDRToIntegratedPDR,
                this.resToIntegratedPDR
            );
        }, this);

        this.officeNewPortion = ko.computed(function() {
            return getNewPortion(
                this.officeGFA,
                this.oldPDRToOffice,
                this.newPDRToOffice,
                this.resToOffice
            );
        }, this);

        this.researchAndDevelopmentNewPortion = ko.computed(function() {
            return getNewPortion(
                this.newResearchAndDevelopment,
                this.oldPDRToResearchAndDevelopment,
                this.newPDRToResearchAndDevelopment,
                this.resToResearchAndDevelopment
            );
        }, this);

        this.retailNewPortion = ko.computed(function() {
            return getNewPortion(
                this.newRetail,
                this.oldPDRToRetail,
                this.newPDRToRetail,
                this.resToRetail
            );
        }, this);

        this.smallEnterpriseWorkspaceNewPortion = ko.computed(function() {
            return getNewPortion(
                this.newSmallEnterpriseWorkspace,
                this.oldPDRToSmallEnterpriseWorkspace,
                this.newPDRToSmallEnterpriseWorkspace,
                this.resToSmallEnterpriseWorkspace
            );
        }, this);

        this.uncreditedFee = ko.computed(function() {
            if (!this.triggered()) {
                return 0;
            }
            return this.getFeeByType(
                this.entNewPortion,
                this.hotelNewPortion,
                this.integratedPDRNewPortion,
                this.officeNewPortion,
                this.researchAndDevelopmentNewPortion,
                this.retailNewPortion,
                this.smallEnterpriseWorkspaceNewPortion
            ) + this.getFeeByType(
                this.oldPDRToEnt,
                this.oldPDRToHotel,
                this.oldPDRToIntegratedPDR,
                this.oldPDRToOffice,
                this.oldPDRToResearchAndDevelopment,
                this.oldPDRToRetail,
                this.oldPDRToSmallEnterpriseWorkspace,
                true
            ) + this.getFeeByType(
                this.newPDRToEnt,
                this.newPDRToHotel,
                this.newPDRToIntegratedPDR,
                this.newPDRToOffice,
                this.newPDRToResearchAndDevelopment,
                this.newPDRToRetail,
                this.newPDRToSmallEnterpriseWorkspace
            ) + this.getFeeByType(
                this.resToEnt,
                this.resToHotel,
                this.resToIntegratedPDR,
                this.resToOffice,
                this.resToResearchAndDevelopment,
                this.resToRetail,
                this.resToSmallEnterpriseWorkspace
            );
        }, this);

        this.calculatedFee = ko.computed(function() {
            var feeValue = this.uncreditedFee() - this.feeCredit();
            return feeValue > 0 ? feeValue : 0;
        }, this);
    };

    JobsHousingLinkageFee.settings = settings;

    return JobsHousingLinkageFee;
});
