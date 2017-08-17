define([
	'knockout',
	'fees/abstract-fee',
	'json!fees/mock-fee/settings.json',
	'fees/mock-fee/component'
], function (ko, AbstractFee, settings) {
    var MockFee = function(params) {
        AbstractFee.apply(this, [params]);
		this.name = 'mock-fee';
		
		this.mockVariable = settings.mockVariable;
		
		this.json = ko.computed(function () {
			return {
				"test": "test"
			};
		});
    };

    return MockFee;
});