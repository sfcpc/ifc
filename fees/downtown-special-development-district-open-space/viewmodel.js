define([
    'knockout',
    'fees/abstract-fee',
    'json!./settings.json',
    './component'
], function(ko, AbstractFee, settings) {
    var DowntownSpecialDevelopmentDistrictOpenSpaceFee = function(params) {
        this.settings = settings;

        AbstractFee.apply(this, [params]);

        this.triggered = ko.computed(function() {
            return this.isProjectInArea() &&
                (
                    this.newNonRes() +
                    this.nonResGFA() +
                    this.pdrGFA() +
                    this.resGFA() +
                    this.officeGFA() +
                    this.hotelGFA()
                ) / this.totalExistingGFA() >= .2;
        }, this);


        this.ready = ko.computed(function() {
            if (!this.triggered()) {
                return true;
            }
            var openSpaceGFAShortfall = this.openSpaceGFAShortfall();
            return openSpaceGFAShortfall !== null && openSpaceGFAShortfall !== '';
        }, this);

        this.calculatedFee = ko.computed(function() {
            if (!this.triggered()) {
                return 0;
            }
            var openSpaceGFAShortfall = this.openSpaceGFAShortfall();
            return openSpaceGFAShortfall * this.feePerOpenSpaceGFA > 0 ?
                openSpaceGFAShortfall * this.feePerOpenSpaceGFA : 0;

        }, this);
    };

    DowntownSpecialDevelopmentDistrictOpenSpaceFee.settings = settings;

    return DowntownSpecialDevelopmentDistrictOpenSpaceFee;
});
