define([
    'knockout',
    'fees/abstract-fee',
    'json!./settings.json',
    'utils/mapserver',
    './component'
], function(ko, AbstractFee, settings, mapserverUtils) {
    var bicycleParkingInLeiu = function(params) {
        var self = this;
        this.settings = settings;

        AbstractFee.apply(this, [params]);

        this.triggered = ko.computed(function() {
            return (
                    this.netNewUnits() >= 1 ||
                    this.resGFA() >= 1
                );
        }, this);

        this.ready = ko.computed(function() {
            if (!this.triggered()) {
                return true;
            }
            return true;
        }, this);

        this.maxSeniorDwellingUnits = ko.computed(function(){
            return this.netNewUnits() - this.studentDwellingUnits();
        }, this);

        this.maxStudentDwellingUnits = ko.computed(function(){
            return this.netNewUnits() - this.seniorDwellingUnits();
        }, this);

        this.standardDwellingUnits = ko.computed(function(){
            return this.netNewUnits() - this.seniorDwellingUnits() - this.studentDwellingUnits();
        }, this);

        this.numberOfBicycle

        this.feeIfRequired = ko.computed(function() {
            var netNewUnits = this.netNewUnits() || 0;

            return (
                (netNewUnits / this.numberOfDwellingUnitsPerClass2BicycleParking)
            ) * this.class2BicycleParkingInLeiuFee;
        }, this);

        this.calculatedFee = ko.computed(function() {
            if (!this.triggered() || !this.payInLeiu()) {
                return 0;
            }
            return this.feeIfRequired();
        }, this);

        this.numberOfBicycleSpacesRequired = ko.computed(function() {
            return (this.netNewUnits() - this.seniorDwellingUnits() - this.studentDwellingUnits()) / this.numberOfDwellingUnitsPerClass2BicycleParking ;
        }, this);
    };

    bicycleParkingInLeiu.settings = settings;

    return bicycleParkingInLeiu;
});
