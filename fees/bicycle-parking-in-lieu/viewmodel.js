define([
    'knockout',
    'fees/abstract-fee',
    'json!./settings.json',
    './component'
], function(ko, AbstractFee, settings) {
    var BicycleParkingInLieu = function(params) {
        this.settings = settings;

        AbstractFee.apply(this, [params]);

        this.netNewNonResGFA = ko.computed(function() {
            var nonResGFA = parseFloat(this.nonResGFA());
            var newNonRes = parseFloat(this.newNonRes());
            return nonResGFA + newNonRes;
        }, this);

        this.triggered = ko.computed(function() {
            return (
                this.netNewUnits() >= 1 ||
                this.resGFA() >= 1 ||
                this.netNewNonResGFA() >= 1
            );
        }, this);

        this.isArticle25 = ko.computed(function() {
            return this.article25;
        }, this);

        this.ready = ko.computed(function() {
            if (!this.triggered()) {
                return true;
            }
            var spacesInLieu = this.spacesInLieu();
            return spacesInLieu !== null && spacesInLieu !== '';
        }, this);

        this.calculatedFee = ko.computed(function() {
            var spacesInLieu = this.spacesInLieu();
            if (!this.triggered() || spacesInLieu === 0) {
                return 0;
            }
            return spacesInLieu * this.inLieuFee;
        }, this);

        ko.computed(this.spacesInLieu)
            .extend({ throttle: 600 })
            .subscribe(function(spacesInLieu) {
                if (parseFloat(spacesInLieu) > 20) {
                    this.spacesInLieu(20);
                }
            }, this);
    };

    BicycleParkingInLieu.settings = settings;

    return BicycleParkingInLieu;
});
