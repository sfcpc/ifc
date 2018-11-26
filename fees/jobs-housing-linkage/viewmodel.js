define([
    'knockout',
    'fees/abstract-fee',
    'json!./settings.json',
    './component'
], function(ko, AbstractFee, settings) {
    var JobsHousingLinkageFee = function(params) {
        var self = this;
        this.settings = settings;

        AbstractFee.apply(this, [params]);

        this.triggered = ko.computed(function() {
            return (
                this.newNonRes() + this.nonResGFA() >= this.minNonResGFA
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

        this.getFeeByType = function(ent, hotel, integratedPDR, office, researchAndDevelopment, retail, smallEnterpriseWorkspace, modifier) {
            if (!modifier) {
                modifier = 0;
            }
            ent = ent() || 0;
            hotel = hotel() || 0;
            integratedPDR = integratedPDR() || 0;
            office = office() || 0;
            researchAndDevelopment = researchAndDevelopment() || 0;
            retail = retail() || 0;
            smallEnterpriseWorkspace = smallEnterpriseWorkspace() || 0;
            return ((this.feePerNewEntertainment + modifier) * ent) +
                ((this.feePerNewHotel + modifier) * hotel) +
                ((this.feePerNewIntegratedPDR + modifier) * integratedPDR) +
                ((this.feePerNewOffice + modifier) * office) +
                ((this.feePerNewResearchAndDevelopment + modifier) * researchAndDevelopment) +
                ((this.feePerNewRetail + modifier) * retail) +
                ((this.feePerNewSmallEnterpriseWorkspace + modifier) * smallEnterpriseWorkspace);
        };

        this.uncreditedFee = ko.computed(function() {
            if (!this.triggered()) {
                return 0;
            }
            return this.getFeeByType(
                this.newEnt,
                this.hotelGFA,
                this.newIntegratedPDR,
                this.officeGFA,
                this.newResearchAndDevelopment,
                this.newRetail,
                this.newSmallEnterpriseWorkspace
            ) + this.getFeeByType(
                this.oldPDRToEnt,
                this.oldPDRToHotel,
                this.oldPDRToIntegratedPDR,
                this.oldPDRToOffice,
                this.oldPDRToResearchAndDevelopment,
                this.oldPDRToRetail,
                this.oldPDRToSmallEnterpriseWorkspace,
                this.oldPDRFeeModifier
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
