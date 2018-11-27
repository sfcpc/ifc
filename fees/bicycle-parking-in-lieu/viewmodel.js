define([
    'knockout',
    'fees/abstract-fee',
    'json!./settings.json',
    'utils/mapserver',
    './component'
], function(ko, AbstractFee, settings, mapserverUtils) {
    var bicycleParkingInLieu = function(params) {
        // var self = this;
        this.settings = settings;

        AbstractFee.apply(this, [params]);

        this.netNewNonResGFA = ko.computed(function() {
            return parseFloat(this.nonResGFA()) + parseFloat(this.newNonRes());
        }, this);

        this.triggered = ko.computed(function() {
            return (
                this.netNewUnits() >= 1 ||
                this.resGFA() >= 1 ||
                this.netNewNonResGFA() >= 1
            );
        }, this);

        this.ready = ko.computed(function() {
            if (!this.triggered()) {
                return true;
            }
            return this.numberOfBicycleSpacesInLieu() !== null && this.numberOfBicycleSpacesInLieu() !== '';
        }, this);

        this.maxSeniorDwellingUnits = ko.computed(function() {
            return this.netNewUnits() - this.studentDwellingUnits();
        }, this);

        this.maxStudentDwellingUnits = ko.computed(function() {
            return this.netNewUnits() - this.seniorDwellingUnits();
        }, this);

        this.standardDwellingUnits = ko.computed(function() {
            return this.netNewUnits() - this.seniorDwellingUnits() - this.studentDwellingUnits();
        }, this);

        this.calculatedFee = ko.computed(function() {
            if (!this.triggered() || this.numberOfBicycleSpacesInLieu() === 0) {
                return 0;
            }
            return this.numberOfBicycleSpacesInLieu() * this.class2BicycleParkingInLieuFee;
        }, this);

        this.numberOfBicycleSpacesRequired = ko.computed(function() {
            var residentialCalculation = this.netNewUnits() <= 3 ? 0
                : ((this.studentDwellingUnits() / this.numberOfDwellingUnitsPerClass2BicycleParking) * this.studentHousingMultiplier) +
                  ((this.seniorDwellingUnits() === '0' || this.seniorDwellingUnits() === null || this.seniorDwellingUnits() === '') ? 0
                      : (this.seniorDwellingUnits() < 100 ? 2
                          : (this.seniorDwellingUnits() / this.numberOfSeniorHousingPerClass2BicycleParking * 2))) +
                  (this.standardDwellingUnits() / this.numberOfDwellingUnitsPerClass2BicycleParking);

            var automotiveCalculation =
                ((this.automotiveParkingSpots() === '0' || this.automotiveParkingSpots() === null || this.automotiveParkingSpots() === '') ? 0
                    : Math.max(this.automotiveParkingSpots() / 20, 6)) +
                    ((this.automotiveNonParking() === '0' || this.automotiveNonParking() === null || this.automotiveNonParking() === '') ? 0
                        : (this.automotiveNonParking() > 5000 ? 4 : 2));

            var entertainmentCalculation = (this.entertainmentArena() >= 2000 ? (this.entertainmentArena()) * 0.05 : 0) +
                (this.entertainmentArts() > 0 ? Math.max(2, this.entertainmentArts() / 2500) : 0);
            // this.entertainmentGeneral()

            var industrialCalculation = this.industrialSpace() > 0 ? (this.industrialSpace() > 50000 ? 4 : 2) : 0;
            var institutionalCalculation = (this.childCareChildren() / 20) +
                (this.publicAccessibleGSF() / 2500 > 2 ? this.publicAccessibleGSF() / 2500 : 2);
            var salesCalculation = 0;

            return (
                residentialCalculation +
                automotiveCalculation +
                entertainmentCalculation +
                industrialCalculation +
                institutionalCalculation +
                salesCalculation
            );
        }, this);

        this.maxInLieuOption = ko.computed(function() {
            var max = (this.numberOfBicycleSpacesRequired() / 2);
            if (this.numberOfBicycleSpacesRequired() <= 4) {
                return this.numberOfBicycleSpacesRequired();
            } else if (max > this.maxInLieu) {
                return this.maxInLieu;
            } else if (max <= 1) {
                return 0;
            }
            return max;
        }, this);
    };

    bicycleParkingInLieu.settings = settings;

    return bicycleParkingInLieu;
});
