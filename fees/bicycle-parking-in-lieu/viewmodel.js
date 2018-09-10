define([
    'knockout',
    'fees/abstract-fee',
    'json!./settings.json',
    'utils/mapserver',
    './component'
], function(ko, AbstractFee, settings, mapserverUtils) {
    var bicycleParkingInLeiu = function(params) {
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
            return true;
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
            if (!this.triggered() || this.numberOfBicycleSpacesInLeiu() === 0) {
                return 0;
            }
            return this.numberOfBicycleSpacesInLeiu() * this.class2BicycleParkingInLeiuFee;
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

            var entertainmentCalculation = 0;
            var industrialCalculation = 0;
            var institutionalCalculation = 0;
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

        this.maxInLeiuOption = ko.computed(function() {
            var max = (this.numberOfBicycleSpacesRequired() / 2);
            if (max > this.maxInLeiu) {
                return this.maxInLeiu;
            } else if (max <= 1) {
                return 0;
            }
            return max;
        }, this);
    };

    bicycleParkingInLeiu.settings = settings;

    return bicycleParkingInLeiu;
});
